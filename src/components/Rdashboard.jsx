import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiHome, FiUserCheck } from "react-icons/fi";

const Rdashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const renterId = localStorage.getItem("renterid");
    if (!renterId) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const apiResponse = await axios.get(`https://easyhomes.onrender.com/renter/${renterId}`);
        setUser(apiResponse.data.renter);
      } catch (error) {
        console.error("Error fetching renter data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen  p-4 relative overflow-hidden">
      {/* Decorative animated background */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000 top-0 right-0"></div>

      {user ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full max-w-lg bg-white/10 backdrop-blur-lg shadow-xl p-8 rounded-3xl border border-white/20 text-center text-white relative z-10"
        >
          <h1 className="text-3xl font-bold mb-4 border-b pb-2 border-white/30">Renter Dashboard</h1>
          <h2 className="text-xl font-semibold mb-1">{user.firstname} {user.lastname}</h2>
          <h3 className="text-sm text-gray-300 mb-4">{user.email}</h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-200 mb-6 text-left">
            <p className="font-semibold">First Name:</p> <p>{user.firstname || "N/A"}</p>
            <p className="font-semibold">Last Name:</p> <p>{user.lastname || "N/A"}</p>
            <p className="font-semibold">Mobile:</p> <p>{user.mobile || "N/A"}</p>
            <p className="font-semibold">User ID:</p> <p>{user._id || "N/A"}</p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              to="/homes"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full shadow-md transition-all"
            >
              <FiHome /> Listed Homes
            </Link>
            <Link
              to="/request"
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full shadow-md transition-all"
            >
              <FiUserCheck /> Home Requests
            </Link>
          </div>
        </motion.div>
      ) : (
        <p className="text-white">Loading user data...</p>
      )}
    </div>
  );
};

export default Rdashboard;
