import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const StartBuilding = () => {

  const headingRef = useRef(null)

useGSAP(
  () => {
    gsap.from(".animate-item", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
      scale: 1.05,
      scrollTrigger: {
        trigger: ".animate-item",
        start: "top 85%",
      },
    });
  },
  { scope: headingRef }
);



  return (
    <section ref={headingRef} className="start-building  w-full mt-24 flex items-center justify-center 
                        py-36 px-6 bg-[#0c0c0c]">

      <div  className="flex flex-col items-center gap-4 text-center max-w-3xl">

        <h1 className="animate-item text-4xl sm:text-5xl lg:text-7xl font-light">
          Start{" "}
          <span className="animate-item text-purple-300 font-medium">
            Building
          </span>
        </h1>

        <p className="animate-item text-base sm:text-lg lg:text-2xl text-gray-400">
          Collaborate in real time with your team and AI.
        </p>

      </div>
    </section>
  );
};

export default StartBuilding;
