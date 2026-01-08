import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import StartBuilding from "./StartBuilding";
import Card from "./Card";
import Footer from "./Footer";

// ✅ REQUIRED
gsap.registerPlugin(useGSAP);

const Hero = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".hero-item", {
        opacity: 0,
        y: 30,
        duration: .8,
        stagger: .1,
        ease: "power2.out",
        scale: 1.1,
        delay: 0.2
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="bg-[#0c0c0c] min-h-screen w-full text-white">
      <div
        ref={containerRef}
        className="min-h-screen main flex flex-col lg:flex-row items-center justify-center
                   pt-12 lg:pt-16 gap-12 lg:gap-20 px-6 lg:px-16"
      >
        <div className="heading max-w-xl text-center lg:text-left">
          <h1 className="hero-item text-5xl sm:text-6xl lg:text-8xl">Chat.</h1>
          <h1 className="hero-item text-5xl sm:text-6xl lg:text-8xl text-purple-300 font-medium">
            Collaborate.
          </h1>
          <h1 className="hero-item text-5xl sm:text-6xl lg:text-8xl">Think Faster.</h1>

          <p className="hero-item text-base sm:text-lg font-light mt-4 text-gray-300">
            A real-time messaging platform with team chat, online presence,
            and built-in AI assistance.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="hero-item bg-purple-600 hover:bg-purple-700 text-lg rounded-full px-10 py-3">
              <Link to="/login">Get Started</Link>
            </button>
            <button className="hero-item bg-gray-800 hover:bg-gray-700 text-lg rounded-full px-10 py-3">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/Ashu243/chatapp-with-ai"
              >
                View on GitHub
              </a>
            </button>
          </div>
        </div>

        <div className="hero-item image w-full max-w-md lg:max-w-[550px]">
          <img
            src="/chat-app.png"
            alt="Chat App Preview"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      <StartBuilding />
      <Card />
      <Footer />
    </div>
  );
};

export default Hero;
