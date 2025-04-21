import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Homes = () => {
  const [homes, setHomes] = useState([]);
  const navigate = useNavigate();

  // Check for notification permission and request if not granted
  const checkNotificationPermission = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("You can now receive notifications!");
        }
      });
    }
  };

  // Show notification when a home is added
  const showHomeAddedNotification = (homeTitle) => {
    if (Notification.permission === "granted") {
      new Notification("🏡 Home Added", {
        body: `${homeTitle} has been successfully listed!`,
        icon: "/homes.jpg",
        vibrate: [200, 100, 300],
        requireInteraction: true,
      });
    }
  };

  useEffect(() => {
    // Check and request notification permission
    checkNotificationPermission();

    const renterId = localStorage.getItem("renterid");
    if (!renterId) {
      navigate("/login");
      return;
    }

    const fetchHomes = async () => {
      try {
        console.log(`Fetching homes for user: ${renterId}`);
        const { data } = await axios.get(`https://easyhomes.onrender.com/renter/${renterId}`);
        setHomes(data?.renter?.homes || []);
      } catch (error) {
        console.error("Error fetching homes:", error);
      }
    };

    fetchHomes();
  }, []);

  const deleteHome = async (homeId) => {
    if (!window.confirm("Are you sure you want to delete this home?")) {
      return;
    }
    try {
      await axios.delete(`https://easyhomes.onrender.com/homes/${homeId}`);
      setHomes((prevHomes) => prevHomes.filter((home) => home._id !== homeId));
    } catch (error) {
      console.error("Error deleting home:", error);
    }
  };

  // To show notification after a home is added (for example, from the send home form)
  const handleAddHome = (newHome) => {
    setHomes((prevHomes) => [...prevHomes, newHome]);
    showHomeAddedNotification(newHome.title);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-10 bg-gradient-to-br ">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-6"
      >
        🏡 Your Listed Homes
      </motion.h2>

      {homes.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {homes.map((home) => (
            <motion.div
              key={home._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xl font-semibold text-indigo-700 mb-1">{home.title}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {home.street}, {home.town}, {home.district}, {home.pincode}
                </p>
                <p className="text-md font-medium text-green-700 mb-3">Rent Price: ₹{home.rentprice}</p>

                {home.images && home.images.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
    {home.images.map((img, i) =>
      img.data && img.contentType ? (
        <img
          key={i}
          src={`data:${img.contentType};base64,${img.data}`}
          alt={`Home Image ${i + 1}`}
          className="w-full h-64 object-cover rounded-lg shadow-sm"
        />
      ) : (
        <p key={i}>Image not available</p>
      )
    )}
  </div>
)}
              </div>

              <button
                onClick={() => deleteHome(home._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full transition-all"
              >
                🗑 Delete Home
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-lg text-gray-700"
        >
          No homes listed yet.
        </motion.p>
      )}
    </div>
  );
};

export default Homes;
