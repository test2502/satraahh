import { useState } from "react";
import picData from "../assets/picData.js"; // adjust this path based on your file structure

const GetPicIdeas = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const images = Object.values(picData);

  const generateImage = () => {
    setIsGenerating(true);

    let interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentImage(images[randomIndex]);
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      const finalIndex = Math.floor(Math.random() * images.length);
      setCurrentImage(images[finalIndex]);
      setIsGenerating(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Get Pic Ideas</h1>

      <div className="w-[90%] max-w-md h-[350px] bg-white shadow-md rounded-lg flex items-center justify-center overflow-hidden">
        {currentImage ? (
          <img
            src={currentImage.src}
            alt="Pose"
            className={`w-full h-full object-cover transition duration-300 ${
              isGenerating ? "blur-md scale-105" : "blur-0"
            }`}
          />
        ) : (
          <p className="text-gray-500 text-center px-4">
            Click Generate to see a suggestion
          </p>
        )}
      </div>

      {!isGenerating && currentImage && (
        <p className="mt-4 text-gray-600">
          Suggested by:{" "}
          <span className="font-semibold">{currentImage.chooser}</span>
        </p>
      )}

      <button
        onClick={generateImage}
        disabled={isGenerating}
        className={`mt-6 px-6 py-2 text-white font-semibold rounded transition duration-300 ${
          isGenerating
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isGenerating ? "Generating..." : "Generate"}
      </button>
    </div>
  );
};

export default GetPicIdeas;
