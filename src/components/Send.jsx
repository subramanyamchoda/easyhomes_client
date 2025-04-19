import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Send = () => {
  const [sendForm, setSendForm] = useState({
    title: "",
    name: "",
    mobile: "",
    street: "",
    town: "",
    district: "",
    pincode: "",
    state: "",
    pluscode: "",
    rentprice: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setSendForm({ ...sendForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setError(null); // Clear any previous errors
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError("You can upload a maximum of 5 images!");
      return;
    }

    setSendForm((prev) => ({ ...prev, images: files }));

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
  };

  // Cleanup to prevent memory leaks
  useEffect(() => {
    return () => previewImages.forEach((url) => URL.revokeObjectURL(url));
  }, [previewImages]);

  const validateForm = () => {
    const { title, name, rentprice, mobile, images } = sendForm;
    if (!title || !name || !rentprice || !mobile) {
      setError("Please fill in all required fields!");
      return false;
    }
    if (images.length === 0) {
      setError("At least one image is required!");
      return false;
    }
    return true;
  };

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification("🎉 Home Added Successfully!", {
        body: message,
        icon: "/homes.jpg",
        vibrate: [200, 100, 300],
        requireInteraction: true,
      });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const loginToken = localStorage.getItem("token");
    if (!loginToken) {
      setMessage("User not authenticated. Please login first.");
      console.error("User not authenticated");
      setLoading(false);
      return;
    }
  
    if (!validateForm()) {
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    Object.keys(sendForm).forEach((key) => {
      if (key === "images") {
        for (let img of sendForm.images) {
          formData.append("images", img);
        }
      } else {
        formData.append(key, sendForm[key]);
      }
    });
  
    try {
      const response = await axios.post("https://easyhomes.onrender.com/homes/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: `${loginToken}`,
        },
      });
      
      // Call showNotification on success
      showNotification("Your home has been successfully added to the EasyHomes platform!");
      
      setSuccess(response.data.message);
      setSendForm({
        title: "",
        name: "",
        mobile: "",
        street: "",
        town: "",
        district: "",
        pincode: "",
        state: "",
        pluscode: "",
        rentprice: "",
        images: [],
      });
      setPreviewImages([]);
      e.target.reset(); // Reset the form including the file input field
    } catch (err) {
      console.error("Error submitting form:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <motion.div
      className="flex flex-col md:flex-row justify-center items-center py-6 px-4 md:px-8 space-y-6 md:space-y-0 md:space-x-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Video Section */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col items-center"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-lg font-bold text-white mb-2">Plus Code</h1>
        <div className="rounded-xl flex bg-white justify-center">
          <video className="w-full max-w-[350px] h-auto md:h-[500px] rounded-lg" autoPlay loop muted playsInline>
            <source src="edit.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </motion.div>

      {/* Form Section */}
      <motion.form
        className="w-full md:w-3/4 lg:w-2/3 bg-white p-6 rounded-lg shadow-2xl"
        onSubmit={submit}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h1 className="text-xl text-center mb-4 font-bold text-blue-700 underline">Send Home Details</h1>
        {success && <p className="text-green-600 text-center">{success}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        {message && <p className="text-yellow-600 text-center">{message}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {["title", "name", "mobile", "street", "town", "district", "pincode", "state", "pluscode", "rentprice"].map((field, idx) => (
            <InputField key={idx} label={field.toUpperCase()} name={field} value={sendForm[field]} onChange={handleChange} />
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Upload Images (1-5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded-lg"
            id="file-input"
          />
        </div>

        {previewImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {previewImages.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index + 1}`} className="h-20 w-20 object-cover rounded-md shadow-md" />
            ))}
          </div>
        )}

        <motion.button
          type="submit"
          className="mt-6 w-full bg-blue-700 text-white rounded-lg p-2 hover:bg-blue-800 focus:ring-4 focus:outline-none"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
        >
          {loading ? "Submitting..." : "Submit"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-600" required />
  </div>
);

export default Send;
