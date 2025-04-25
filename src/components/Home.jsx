import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import TextPressure from '../blocks/TextPressure';
import AdUnit from '../components/AdUnit';


const Home = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered");

          if (Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted" && !localStorage.getItem("notificationShown")) {
                sendWelcomeNotification(registration);
                localStorage.setItem("notificationShown", "true");  // Set flag in localStorage
              }
            });
          } else if (Notification.permission === "granted" && !localStorage.getItem("notificationShown")) {
            sendWelcomeNotification(registration);
            localStorage.setItem("notificationShown", "true");  // Set flag in localStorage
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

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8 px-4 text-center">
      {/* Image Section */}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-14 w-full max-w-5xl">
        <motion.img 
          src="home1.jpg" 
          alt="Modern home exterior" 
          className="w-48 sm:w-60 md:w-72 lg:w-80 rounded-lg shadow-lg mx-auto" 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.img 
          src="home4.jpeg" 
          alt="Cozy home interior" 
          className="w-48 sm:w-60 md:w-72 lg:w-80 rounded-lg shadow-lg mx-auto" 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <section className="ad-section">
        <AdUnit slot="7484094536" />   {/* your Ad Unit ID */}
      </section>
      
      {/* Title */}
      <motion.div 
        className="text-center my-7 w-full px-4"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
      >
        <div className="relative w-full max-w-5xl mx-auto flex justify-center">
          <TextPressure
            text="Find Your House"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="white"
            strokeColor="black"
            minFontSize={50}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          />
        </div>
      </motion.div>

      {/* More Images */}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-14 w-full max-w-5xl">
        <motion.img 
          src="home2.jpeg" 
          alt="Modern home exterior" 
          className="w-48 sm:w-60 md:w-72 lg:w-80 rounded-lg shadow-lg mx-auto" 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.img 
          src="home3.jpg" 
          alt="Cozy home interior" 
          className="w-48 sm:w-60 md:w-72 lg:w-80 rounded-lg shadow-lg mx-auto" 
          animate={{ rotate: [0, 5, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

export default Home;
