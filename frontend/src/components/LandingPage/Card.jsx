import React from "react";

const Card = () => {
  return (
    <section className="w-full flex justify-center py-4 px-6">
      <div className="w-full max-w-7xl">

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

          {/* Step 01 */}
          <div className="border-t border-zinc-800 pt-6">
            <p className="text-purple-400 text-sm mb-3">01</p>

            <h3 className="text-2xl sm:text-3xl font-light mb-4">
              Create a Workspace
            </h3>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Set up a project, invite your team, and manage conversations
              in a shared workspace built for collaboration.
            </p>
          </div>

          {/* Step 02 */}
          <div className="border-t border-zinc-800 pt-6">
            <p className="text-purple-400 text-sm mb-3">02</p>

            <h3 className="text-2xl sm:text-3xl font-light mb-4">
              Chat in Real Time
            </h3>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Instant messaging with typing indicators, online presence,
              and real-time updates — no refresh needed.
            </p>
          </div>

          {/* Step 03 */}
          <div className="border-t border-zinc-800 pt-6">
            <p className="text-purple-400 text-sm mb-3">03</p>

            <h3 className="text-2xl sm:text-3xl font-light mb-4">
              Ask AI Anything
            </h3>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Mention{" "}
              <span className="text-white bg-zinc-800 px-2 py-1 rounded-md text-sm">
                @ai
              </span>{" "}
              in chat to get instant explanations, ideas, and technical help.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Card;
