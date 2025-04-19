import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const UserLogin = ({ setUser, setUserType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to show notification after login success
  const showNotification = (name) => {
    if (Notification.permission === "granted") {
      new Notification("🎉 Login Successful!", {
        body: `Welcome back, ${name}! 🏡`,
        icon: "/homes.jpg", // Add an appropriate icon for your notification
        vibrate: [200, 100, 300],
        requireInteraction: true,
      });
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { credential } = credentialResponse;
      const { data } = await axios.post(
        "https://easyhomes.onrender.com/user/login",
        { token: credential },
        { withCredentials: true }
      );

      const user = data.user;
      const formatted = {
        name: user.name,
        email: user.email,
        avatar: user.avatar || "https://via.placeholder.com/150",
        mobile: user.mobile,
        id: user._id,
        role: user.role || "user",
      };

      setUser(formatted);
      setUserType(formatted.role);
      localStorage.setItem("user", JSON.stringify(formatted));
      localStorage.setItem("userId", formatted.id);
      localStorage.setItem("userRole", formatted.role);
      
      // Show notification after successful login
      showNotification(user.name);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginFailure = (err) => {
    console.error(err);
    setError("Google authentication error.");
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Circles */}
        <motion.div
          className="absolute top-10 left-[-50px] w-80 h-80 bg-blue-500 rounded-full opacity-20 filter blur-3xl"
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-[-50px] w-96 h-96 bg-purple-500 rounded-full opacity-20 filter blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl max-w-sm w-full p-8 z-10 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl font-extrabold text-white mb-4"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome Back!
          </motion.h1>
          <motion.p
            className="text-gray-200 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Sign in with your Google account to continue to EasyHomes.
          </motion.p>

          {error && (
            <motion.div
              className="text-red-400 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              useOneTap
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled || loading}
                  className="flex items-center justify-center gap-2 w-full bg-white text-gray-800 font-semibold py-2 px-4 rounded-full shadow hover:shadow-lg hover:bg-gray-100 transition"
                >
                  <FcGoogle className="text-2xl" />
                  {loading ? "Signing in..." : "Sign in with Google"}
                </button>
              )}
            />
          </motion.div>

          <motion.div
            className="mt-6 text-sm text-gray-300 items-center justify-center flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <img src="home.png" alt="" className="w-20 rounded-2xl" />
          </motion.div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default UserLogin;
