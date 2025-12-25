import Markdown from "markdown-to-jsx";
import React, { useEffect, useRef } from "react";

const RightPane = ({ aiMessages, aiTyping }) => {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages]);

    return (
        <div className="flex-1 bg-[#0f0f0f] flex flex-col">

            {/* Header */}
            <div className="p-4 border-b border-[#222] flex justify-center">
                <div className="px-4 py-2 rounded-xl">
                    AI Responses
                </div>
            </div>

            
        </div>
    );
};

export default RightPane;
