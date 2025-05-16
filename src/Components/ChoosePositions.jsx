import { useState, useEffect, useRef } from "react";
import picData from "../assets/picData.js";
import partySound from "/src/assets/party.opus";

const ChoosePosition = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [countdown7, setCountdown7] = useState(null);
  const [countdown2Min, setCountdown2Min] = useState(null);
  const [partyStarted, setPartyStarted] = useState(false);
  const [shownImages, setShownImages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // New states
  const [playerANoPhotos, setPlayerANoPhotos] = useState([]);
  const [playerBNoPhotos, setPlayerBNoPhotos] = useState([]);
  const [playerACount, setPlayerACount] = useState(0);
  const [playerBCount, setPlayerBCount] = useState(0);
  const [chooseFromA, setChooseFromA] = useState(false);
  const [chooseFromB, setChooseFromB] = useState(false);

  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const countdown7Ref = useRef(null);
  const countdown2MinRef = useRef(null);

  const allImages = Object.values(picData);

  const getUnshownImages = () => {
    return allImages.filter((img) => !shownImages.includes(img.src));
  };

  const generateImage = () => {
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
      setShownImages([]);
      return generateImage();
    }

    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * unshown.length);
      setCurrentImage(unshown[randomIndex]);
    }, 150);

    setTimeout(() => {
      clearInterval(intervalRef.current);

      const freshUnshown = getUnshownImages();
      const finalIndex = Math.floor(Math.random() * freshUnshown.length);
      const finalImage = freshUnshown[finalIndex];

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

  const handleNo = (player) => {
    if (!currentImage) return;

    if (player === "A") {
      setPlayerANoPhotos((prev) => [...prev, currentImage]);
      setPlayerACount((prev) => {
        const newCount = prev + 1;
        if (newCount % 3 === 0) {
          setChooseFromA(true); // Player B can now choose
        }
        return newCount;
      });
    } else if (player === "B") {
      setPlayerBNoPhotos((prev) => [...prev, currentImage]);
      setPlayerBCount((prev) => {
        const newCount = prev + 1;
        if (newCount % 3 === 0) {
          setChooseFromB(true); // Player A can now choose
        }
        return newCount;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdown7Ref.current) clearInterval(countdown7Ref.current);
      if (countdown2MinRef.current) clearInterval(countdown2MinRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-row bg-gray-100 relative">
      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        {/* Breadcrumb button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md"
        >
          {sidebarOpen ? "Hide Images" : "Show Images"}
        </button>

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

        {/* {!isGenerating && currentImage && (
          <p className="mt-4 text-gray-600">
            Suggested by:{" "}
            <span className="font-semibold">{currentImage.chooser}</span>
          </p>
        )} */}

        {isFinal && countdown7 !== null && !partyStarted && (
          <p className="mt-4 text-blue-600 text-lg">
            Fun starts in: {countdown7}s
          </p>
        )}

        {partyStarted && countdown2Min !== null && (
          <p className="mt-2 text-lg text-green-600">
            Time left: {Math.floor(countdown2Min / 60)}:
            {(countdown2Min % 60).toString().padStart(2, "0")}
          </p>
        )}

        {partyStarted && countdown2Min !== null && (
          <p className="mt-4 text-2xl font-bold text-pink-600 animate-bounce">
            Let The Fun Begin! 🥵🔥
          </p>
        )}

        {/* Generate Button */}
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

        {/* Who said NO Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => handleNo("A")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Player A says NO
          </button>
          <button
            onClick={() => handleNo("B")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Player B says NO
          </button>
        </div>

        {/* Audio */}
        <audio ref={audioRef} src={partySound} />

        {/* Player NO Sections */}
        <div className="flex flex-col md:flex-row mt-8 space-y-6 md:space-y-0 md:space-x-8">
          {/* Player A NO Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Player A's NO Photos
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {playerANoPhotos.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={`Player A NO ${index}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
            {chooseFromA && (
              <p className="mt-4 text-center text-green-600 font-bold">
                Player B, Choose a Photo from Player A's NOs!
              </p>
            )}
          </div>

          {/* Player B NO Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Player B's NO Photos
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {playerBNoPhotos.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={`Player B NO ${index}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
            {chooseFromB && (
              <p className="mt-4 text-center text-green-600 font-bold">
                Player A, Choose a Photo from Player B's NOs!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out p-4
        top-0 right-0 h-full w-80
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Generated Images
        </h2>

        {shownImages.length === 0 ? (
          <p className="text-gray-400 text-center">No images yet!</p>
        ) : (
          <div className="flex flex-col space-y-4">
            {shownImages.map((src, index) => (
              <div
                key={index}
                className="w-full h-54 bg-gray-100 rounded overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Generated ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChoosePosition;
