import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Request = () => {
  const [user, setUser] = useState(null);
  const [renterId, setRenterId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("renterid");
    if (!id) {
      navigate("/login");
      return;
    }
    setRenterId(id);
    fetchUserData(id);
  }, [navigate]);

  const fetchUserData = async (id) => {
    try {
      const { data } = await axios.get(`https://easyhomes.onrender.com/renter/${id}`);
      if (data.renter) {
        setUser(data.renter);
      } else {
        console.error("Renter not found.");
      }
    } catch (error) {
      console.error("Error fetching renter:", error);
    }
  };

  const handleAcceptRequest = async (commitId) => {
    try {
      const { data } = await axios.post(
        `https://easyhomes.onrender.com/commit/accept-request/${commitId}`
      );
      alert(data.message);
      fetchUserData(renterId); // refresh data to get updated accepted status
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request.");
    }
  };

  const handleDeleteRequest = async (commitId) => {
    try {
      await axios.delete(`https://easyhomes.onrender.com/delete-request/${commitId}`);
      alert("Request Deleted!");
      fetchUserData(renterId); // refresh data
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-ping" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 m-4 border border-white/30"
      >
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
          📨 Incoming Home Requests
        </h1>

        {user?.commits?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {user.commits.map((commit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-2xl bg-white/80 border border-gray-200 shadow-lg flex flex-col items-center transition-all"
              >
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-semibold">Request ID:</span> {commit._id}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-semibold">Name:</span> {commit.userId?.name || "N/A"}
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  <span className="font-semibold">Email:</span> {commit.userId?.email || "N/A"}
                </p>

                <div className="flex gap-4">
                  {commit.accepted ? (
                    <span className="text-green-600 font-bold text-sm">✅ Done</span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAcceptRequest(commit._id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-md"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(commit._id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow-md"
                      >
                        ❌ Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-white text-lg text-center mt-8">No commit requests available yet.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Request;
