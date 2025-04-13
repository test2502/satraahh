import { useState, useEffect, useRef } from "react";
import picData from "/src/assets/picData.js";
import partySound from "/src/assets/party.opus";

const ChoosePosition = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [countdown7, setCountdown7] = useState(null);
  const [countdown2Min, setCountdown2Min] = useState(null);
  const [partyStarted, setPartyStarted] = useState(false);
  const [shownImages, setShownImages] = useState([]);

  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const countdown7Ref = useRef(null);
  const countdown2MinRef = useRef(null);

  const allImages = Object.values(picData);

  const getUnshownImages = () => {
    return allImages.filter((img) => !shownImages.includes(img.src));
  };

  const generateImage = () => {
    // Clear previous states and intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdown7Ref.current) clearInterval(countdown7Ref.current);
    if (countdown2MinRef.current) clearInterval(countdown2MinRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsGenerating(true);
    setIsFinal(false);
    setCountdown7(null);
    setCountdown2Min(null);
    setPartyStarted(false);

    const unshown = getUnshownImages();

    if (unshown.length === 0) {
      setShownImages([]); // Reset shown images
      return generateImage(); // Recursively call to restart cycle
    }

    // Preview blur rotation
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * unshown.length);
      setCurrentImage(unshown[randomIndex]);
    }, 150);

    // Final pick after 5s
    setTimeout(() => {
      clearInterval(intervalRef.current);

      const unshown = getUnshownImages();
      const finalIndex = Math.floor(Math.random() * unshown.length);
      const finalImage = unshown[finalIndex];

      setCurrentImage(finalImage);
      setShownImages((prev) => [...prev, finalImage.src]);
      setIsGenerating(false);
      setIsFinal(true);
      startCountdown7();
    }, 5000);
  };

  const startCountdown7 = () => {
    let timeLeft = 7;
    setCountdown7(timeLeft);

    countdown7Ref.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown7(timeLeft);
      if (timeLeft === 0) {
        clearInterval(countdown7Ref.current);
        setPartyStarted(true);
        audioRef.current.play();
        start2MinCountdown();
      }
    }, 1000);
  };

  const start2MinCountdown = () => {
    let timeLeft = 120;
    setCountdown2Min(timeLeft);

    countdown2MinRef.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown2Min(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(countdown2MinRef.current);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdown7Ref.current) clearInterval(countdown7Ref.current);
      if (countdown2MinRef.current) clearInterval(countdown2MinRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Choose a Position
      </h1>

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
          <p className="text-gray-500">Click Generate to start!</p>
        )}
      </div>

      {!isGenerating && currentImage && (
        <p className="mt-4 text-gray-600">
          Suggested by:{" "}
          <span className="font-semibold">{currentImage.chooser}</span>
        </p>
      )}

      {isFinal && countdown7 !== null && !partyStarted && (
        <p className="mt-4 text-blue-600 text-lg">
          Party starts in: {countdown7}s
        </p>
      )}

      {partyStarted && countdown2Min !== null && (
        <p className="mt-2 text-lg text-green-600">
          Time left: {Math.floor(countdown2Min / 60)}:
          {(countdown2Min % 60).toString().padStart(2, "0")}
        </p>
      )}

      {partyStarted && countdown2Min != null && (
        <p className="mt-4 text-2xl font-bold text-pink-600 animate-bounce">
          🎉 Let the party begin! 🎉
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

      {/* 🎵 Audio */}
      <audio ref={audioRef} src={partySound} />
    </div>
  );
};

export default ChoosePosition;
