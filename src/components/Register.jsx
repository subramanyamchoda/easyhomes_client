import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [register, setRegister] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    role: "renter",
  });

  const navigate = useNavigate();
  const [errorShake, setErrorShake] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered");

          if (Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                sendWelcomeNotification(registration);
              }
            });
          } else if (Notification.permission === "granted") {
            sendWelcomeNotification(registration);
          }
        })
        .catch((err) => console.error("❌ SW registration failed:", err));
    }
  }, []);

  const sendWelcomeNotification = (registration) => {
    registration.showNotification("🎉 Welcome to Easy Homes!", {
      body: "Find your perfect stay 🏡 Click to explore now!",
      icon: "/homes.jpg",
      vibrate: [200, 100, 200],
      requireInteraction: false,
    });
  };

  const showNotification = (name) => {
    if (Notification.permission === "granted") {
      new Notification(`🎉 Registration Successful, ${name}!`, {
        body: "You are now registered on EasyHomes. Enjoy your stay! 🏡",
        icon: "/homes.jpg",
        vibrate: [200, 100, 300],
        requireInteraction: true,
      });
    }
  };

  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (register.password !== register.confirmPassword) {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    try {
      const response = await axios.post("https://easyhomes.onrender.com/renter/register", {
        firstname: register.firstname,
        lastname: register.lastname,
        email: register.email,
        password: register.password,
        mobile: register.mobile,
        role: register.role,
      });

      // Show notification after successful registration
      showNotification(`${register.firstname} ${register.lastname}`);

      alert("Registration Successful!");
      navigate("/renterlogin");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center py-25"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.form
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
        onSubmit={submit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-center text-3xl font-bold text-gray-700 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Register
        </motion.h1>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="First Name" name="firstname" value={register.firstname} onChange={handleChange} />
          <InputField label="Last Name" name="lastname" value={register.lastname} onChange={handleChange} />
        </div>

        <InputField label="Email Address" name="email" type="email" value={register.email} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-4">
          <motion.div animate={errorShake ? { x: [0, -10, 10, -10, 10, 0] } : {}}>
            <InputField label="Password" name="password" type="password" value={register.password} onChange={handleChange} />
          </motion.div>
          <motion.div animate={errorShake ? { x: [0, -10, 10, -10, 10, 0] } : {}}>
            <InputField label="Confirm Password" name="confirmPassword" type="password" value={register.confirmPassword} onChange={handleChange} />
          </motion.div>
        </div>

        <InputField label="Phone Number" name="mobile" type="tel" value={register.mobile} onChange={handleChange} />

        <motion.button
          type="submit"
          className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-800 text-white font-semibold rounded-lg transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <motion.div
    className="relative w-full p-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      placeholder={label}
      required
    />
  </motion.div>
);

export default Register;
