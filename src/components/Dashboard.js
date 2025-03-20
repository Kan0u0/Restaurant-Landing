import { FaUsers, FaDollarSign, FaShoppingBag, FaChartLine } from "react-icons/fa";

const Dashboard = () => {
  const stats = [
    { label: "Total Users", value: "1,504", color: "bg-purple-500", icon: <FaUsers /> },
    { label: "Total Revenue", value: "$12,750", color: "bg-blue-500", icon: <FaDollarSign /> },
    { label: "Total Orders", value: "324", color: "bg-teal-500", icon: <FaShoppingBag /> },
    { label: "Conversion Rate", value: "85%", color: "bg-orange-500", icon: <FaChartLine /> },
  ];

  const orders = [
    { id: "#ORD-001", customer: "John Smith", date: "15 Mar 2025", amount: "$125.00", status: "Completed" },
    { id: "#ORD-002", customer: "Emma Johnson", date: "14 Mar 2025", amount: "$245.99", status: "Pending" },
    { id: "#ORD-003", customer: "Michael Brown", date: "13 Mar 2025", amount: "$78.50", status: "Completed" },
    { id: "#ORD-004", customer: "Sarah Davis", date: "12 Mar 2025", amount: "$350.00", status: "Cancelled" },
    { id: "#ORD-005", customer: "David Wilson", date: "11 Mar 2025", amount: "$185.25", status: "Completed" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">Export</button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md">+ Add New</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-md flex items-center gap-4 ${stat.color} text-white animate-float`}
          >
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="font-semibold text-lg mb-4">Recent Orders</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Order ID</th>
              <th className="text-left py-2">Customer</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-t">
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.customer}</td>
                <td className="py-2">{order.date}</td>
                <td className="py-2">{order.amount}</td>
                <td
                  className={`py-2 ${
                    order.status === "Completed"
                      ? "text-green-500"
                      : order.status === "Pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
