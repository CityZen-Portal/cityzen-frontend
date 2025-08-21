import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

function ErrorAnimation() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 bg-white dark:bg-navy-700 ">
      <div className="flex flex-col items-center text-center max-w-md w-full p-4">
      
        <Player
          autoplay
          loop
          src="https://assets2.lottiefiles.com/packages/lf20_qp1q7mct.json"
          style={{ height: "280px", width: "400px" }}
        />

   
        <p className="text-gray-800 text-base mt-4 dark:text-white">
          Please refresh or check your Connection
        </p>

        <button
  onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-blue-600 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white rounded hover:bg-gray-900 transition-colors duration-200 text-base"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorAnimation;
