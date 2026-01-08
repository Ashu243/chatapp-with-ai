import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

const Footer = () => {

    const footerRef = useRef(null)

    useGSAP(
        () => {
            gsap.from(".footer-item", {
                opacity: 0,
                // y: 30,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.out",
                scale: 1.05,
                scrollTrigger: {
                    trigger: ".footer-item",
                    start: "top 85%",
                },
            })
        }
    )


    return (
        <footer ref={footerRef} className=" w-full flex items-center justify-center 
                       py-50 px-6 bg-[#0c0c0c]">

            <div className="content flex flex-col items-center gap-6 
                      max-w-3xl text-center">

                <h1 className="footer-item text-4xl sm:text-5xl lg:text-7xl font-light">
                    Join the{" "}
                    <span className="text-purple-300 font-medium">
                        Community
                    </span>
                </h1>

                <p className="footer-item text-gray-400 text-base sm:text-lg">
                    Tap into the power of our community. Get answers, build together,
                    and be part of conversations that move ideas forward.
                </p>

            </div>
        </footer>
    );
};

export default Footer;
