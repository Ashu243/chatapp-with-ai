import React from "react";

const StartBuilding = () => {
  return (
    <section className="w-full flex items-center justify-center 
                        py-46 px-6 bg-[#0c0c0c]">

      <div className="flex flex-col items-center gap-4 text-center max-w-3xl">

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light">
          Start{" "}
          <span className="text-purple-300 font-medium">
            Building
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-2xl text-gray-400">
          Collaborate in real time with your team and AI.
        </p>

      </div>
    </section>
  );
};

export default StartBuilding;
