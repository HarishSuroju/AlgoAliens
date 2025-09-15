// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const stats = [
        { title: "Users", value: 1200 },
        { title: "Orders", value: 305 },
        { title: "Revenue", value: "$45,000" },
        { title: "Products", value: 85 },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-800 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold">Dashboard</div>
                <nav className="flex-1">
                    <Link className="block py-3 px-6 hover:bg-blue-700" to="/dashboard">Home</Link>
                    <Link className="block py-3 px-6 hover:bg-blue-700" to="/users">Users</Link>
                    <Link className="block py-3 px-6 hover:bg-blue-700" to="/orders">Orders</Link>
                    <Link className="block py-3 px-6 hover:bg-blue-700" to="/settings">Settings</Link>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Welcome to Dashboard</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Logout
                    </button>
                </header>

                {/* Stats */}
                <main className="p-6 flex-1 overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.title}
                                className="bg-white p-6 rounded shadow hover:shadow-lg transition"
                            >
                                <p className="text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Additional content */}
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                        <div className="bg-white p-4 rounded shadow">
                            <p>No recent activity yet.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
