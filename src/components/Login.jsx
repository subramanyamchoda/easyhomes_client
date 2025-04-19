import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User as UserIcon, Home as HomeIcon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/${role}login`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-400 opacity-20 rounded-full mix-blend-lighten filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400 opacity-20 rounded-full mix-blend-lighten filter blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" />

      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-white mb-10 z-10 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to EasyHomes
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        {/* Home Seeker Card */}
        <motion.div
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => handleSelect("user")}
        >
          <UserIcon className="w-16 h-16 text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Home Seeker
          </h2>
          <p className="text-gray-600 mb-6">
            Explore and search rental homes on EasyHomes. Find your perfect stay!
          </p>
          <motion.button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            I’m a User
          </motion.button>
        </motion.div>

        {/* Renter/Owner Card */}
        <motion.div
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => handleSelect("renter")}
        >
          <HomeIcon className="w-16 h-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Renter / Owner
          </h2>
          <p className="text-gray-600 mb-6">
            List your property and manage rental details with EasyHomes.
          </p>
          <motion.button
            className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 px-6 rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            I’m a Renter
          </motion.button>
        </motion.div>
      </div>

      {/* Help Link */}
      
    </div>
  );
};

export default Login;