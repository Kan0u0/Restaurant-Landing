import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

const firestore = getFirestore();

const TaskManager = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const taskQuery = query(
        collection(firestore, 'tasks'),
        where('uid', '==', user.uid)
      );
      const querySnapshot = await getDocs(taskQuery);
      const taskList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async () => {
    if (!task || !user) return;
    try {
      await addDoc(collection(firestore, 'tasks'), {
        task,
        uid: user.uid,
        createdAt: new Date(),
      });
      setTask('');
      fetchTasks(); // Refresh after add
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'tasks', id));
      fetchTasks(); // Refresh after delete
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {user ? (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">Task Manager</h2>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Enter task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="flex-grow p-2 border rounded-l-md focus:outline-none"
            />
            <button
              onClick={addTask}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                >
                  <span>{t.task}</span>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No tasks found.</p>
            )}
          </ul>

          <button
            onClick={handleSignOut}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p className="text-xl text-gray-700">Please sign in to manage your tasks.</p>
      )}
    </div>
  );
};

export default TaskManager;
