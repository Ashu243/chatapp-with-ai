import React from "react";
import StartBuilding from "./StartBuilding";
import Card from "./Card";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-[#0c0c0c] min-h-screen w-full text-white">

      {/* HERO SECTION */}
      <div
        className="main flex flex-col lg:flex-row items-center justify-center
                   pt-12 lg:pt-16 gap-12 lg:gap-20 px-6 lg:px-16"
      >

        {/* TEXT (comes first on mobile) */}
        <div className="heading max-w-xl text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl">Chat.</h1>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl text-purple-300 font-medium">
            Collaborate.
          </h1>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl">Think Faster.</h1>

          <p className="text-base sm:text-lg font-light mt-4 text-gray-300">
            A real-time messaging platform with team chat, online presence,
            and built-in AI assistance.
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4
                          justify-center lg:justify-start">
            <button className="bg-purple-600 hover:bg-purple-700
                               text-lg rounded-full px-10 py-3">
              <Link to='/login' >Get Started</Link> 
            </button>
            <button className="bg-gray-800 hover:bg-gray-700
                               text-lg rounded-full px-10 py-3">
             <a target="_blank" href='https://github.com/Ashu243/chatapp-with-ai' >View on GitHub</a> 
            </button>
          </div>
        </div>

        {/* IMAGE (comes after text on mobile) */}
        <div className="image w-full max-w-md lg:max-w-[550px]">
          <img
            src="/chat-app.png"
            alt="Chat App Preview"
            className="w-full h-auto object-contain"
          />
        </div>

      </div>

      {/* OTHER SECTIONS */}
      <StartBuilding />
      <Card />
      <Footer />
    </div>
  );
};

export default Hero;
