import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { User as UserIcon, Home as HomeIcon } from "lucide-react";

const RenterLogin = ({ setUser, setUserType }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const showNotification = (email) => {
    if (Notification.permission === "granted") {
      new Notification("🎉 Login Successful!", {
        body: `Welcome back, ${email}! 🏡`,
        icon: "/homes.jpg",
        vibrate: [200, 100, 300],
        requireInteraction: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setMessage("Email and password are required!");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        "https://easyhomes.onrender.com/renter/login",
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.securityToken) {
        const renterName = response.data.firstname;  // Assuming the name is in `firstname`

        localStorage.setItem("token", response.data.securityToken);
        localStorage.setItem("renterid", response.data.renterId);
        localStorage.setItem("userType", "renter");

        setUser({ id: response.data.renterId, email: credentials.email });
        setUserType("renter");

        showNotification(credentials.email); // Pass the email to the notification function
        setMessage("Login successful! 🎉");

        navigate("/rdashboard");
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 underline">
          Renter Login
        </h2>

        {message && (
          <p
            className={`text-center mb-4 p-2 rounded-lg ${
              message.includes("successful") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition-all"
            required
            value={credentials.email}
            onChange={handleChange}
            whileFocus={{ scale: 1.05 }}
          />

          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition-all"
            required
            value={credentials.password}
            onChange={handleChange}
            whileFocus={{ scale: 1.05 }}
          />

          <motion.button
            type="submit"
            className="w-full p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-800 transition-all transform hover:scale-105 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

          <div className="text-center">
            <Link to="/register" className="text-md text-blue-900 hover:underline">
              Don't have an account? <u>Register</u>
            </Link>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RenterLogin;
