import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const UserHomes = () => {
  const [home, setHome] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchAcceptedHomes = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User not logged in.");
          return;
        }

        const { data } = await axios.get(
          `https://easyhomes.onrender.com/commit/accepted-property/${userId}`
        );
        setHome(data.homes);
        console.log(data);
      } catch (err) {
        console.error("Error fetching accepted homes:", err);
        setError("Could not fetch accepted homes.");
      }
    };

    fetchAcceptedHomes();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage("");
  };

  const openLocationOnGoogleMaps = (pluscode) => {
    if (!pluscode) {
      alert("Plus Code is missing.");
      return;
    }
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pluscode)}`;
    window.open(mapsUrl, "_blank");
  };

  if (error) {
    return <p className="text-red-600 text-center mt-3">{error}</p>;
  }

  if (home.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.p
          className="text-gray-600 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Loading your accepted homes...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <motion.h2
        className="text-3xl font-bold text-center text-indigo-600 mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Your Accepted Homes
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {home.map((home, index) => (
          <motion.div
            key={index}
            className="bg-white border border-gray-300 rounded-2xl shadow-lg p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-800 mt-4">
              {[
                ["Title", home.title],
                ["Name", home.name],
                ["Mobile", home.mobile],
                ["Street", home.street],
                ["Town", home.town],
                ["District", home.district],
                ["Pincode", home.pincode],
                ["Rent", `₹${home.rentprice}`],
              ].map(([label, value], idx) => (
                <div
                  key={idx}
                  className="flex flex-col border border-gray-200 rounded-md p-3"
                >
                  <span className="font-semibold text-gray-600">{label}:</span>
                  <span className="text-gray-800">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <button
                onClick={() => openLocationOnGoogleMaps(home.pluscode)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition-transform hover:scale-105 text-sm"
              >
                View on Map
              </button>
              <a
                href={`tel:+91${home.mobile}`}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition-transform hover:scale-105 text-sm"
              >
                Call Now
              </a>
            </div>

            <div className="mt-6">
                <p className="text-lg text-gray-500 text-center mb-2 animate-bounce">
                    Click on an image to view it in full size.
                  </p>
                  <Carousel
  showThumbs={false}
  infiniteLoop
  autoPlay
  emulateTouch
  showStatus={false}
  className="rounded-xl overflow-hidden"
>
  {home.images.map((img, i) => {
    if (img.base64 && img.contentType) {
      const base64String = `data:${img.contentType};base64,${img.base64}`;
      return (
        <img
          key={i}
          src={base64String}
          alt={`Home Image ${i + 1}`}
          onClick={() => handleImageClick(base64String)}
          className="w-full h-64 object-cover rounded-lg shadow-sm cursor-pointer"
        />
      );
    } else {
      return <p key={i}>Image not available</p>;
    }
  })}
</Carousel>


            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Preview */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <motion.div
            className="bg-white rounded-xl p-4 max-w-3xl w-full relative"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-2xl text-red-600"
            >
              &times;
            </button>
            <img
              src={`https://easyhomes.onrender.com/uploads/${selectedImage}`}
              alt="Preview"
              className="w-full h-[70vh] object-contain rounded-md"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserHomes;
