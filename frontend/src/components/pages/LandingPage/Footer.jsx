import React from "react";

const Footer = () => {
    return (
        <footer className=" w-full flex items-center justify-center 
                       py-90 px-6 bg-[#0c0c0c]">

            <div className="content flex flex-col items-center gap-6 
                      max-w-3xl text-center">

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light">
                    Join the{" "}
                    <span className="text-purple-300 font-medium">
                        Community
                    </span>
                </h1>

                <p className="text-gray-400 text-base sm:text-lg">
                    Tap into the power of our community. Get answers, build together,
                    and be part of conversations that move ideas forward.
                </p>

            </div>
        </footer>
    );
};

export default Footer;
