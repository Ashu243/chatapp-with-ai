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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                <div className="bg-[#111] border border-[#222] rounded-2xl p-5 text-gray-200">
                    
                    {aiMessages.map((msg, index) => {
                        return <Markdown key={index}
                            options={{
                                overrides: {
                                    h1: {
                                        props: { className: "text-xl font-semibold mb-3 text-white" },
                                    },
                                    h2: {
                                        props: { className: "text-lg font-semibold mb-2 text-white" },
                                    },
                                    p: {
                                        props: { className: "text-sm leading-relaxed mb-3 text-gray-300" },
                                    },
                                    ul: {
                                        props: { className: "list-disc ml-5 mb-3 text-gray-300" },
                                    },
                                    li: {
                                        props: { className: "mb-1" },
                                    },
                                    pre: {
                                        props: {
                                            className:
                                                "bg-[#0b0b0b] border border-[#222] rounded-xl p-4 overflow-x-auto my-4",
                                        },
                                    },
                                    code: {
                                        props: {
                                            className:
                                                "text-purple-400 text-sm font-mono whitespace-pre-wrap break-words",
                                        },
                                    },
                                },
                            }}
                        >
                            {msg.content}
                        </Markdown>
                    })}
                    {aiTyping && (
                        <div className="text-xs text-gray-400 italic px-4 mb-2">
                            AI is typing<span className="animate-pulse">...</span>
                        </div>
                    )}

                </div>

                <div ref={endRef} />
            </div>
        </div>
    );
};

export default RightPane;
