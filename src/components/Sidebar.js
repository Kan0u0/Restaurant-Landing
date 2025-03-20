import { FaHome, FaUser, FaBox, FaShoppingCart, FaChartPie, FaCog } from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { icon: <FaHome />, label: "Dashboard" },
    { icon: <FaUser />, label: "Users" },
    { icon: <FaBox />, label: "Products" },
    { icon: <FaShoppingCart />, label: "Orders" },
    { icon: <FaChartPie />, label: "Analytics" },
    { icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-[#111827] text-white h-screen p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all 
                      bg-[#1F2937] hover:bg-[#374151] hover:scale-105 hover:shadow-lg 
                      hover:shadow-blue-500/30 transform duration-300 ease-out"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

