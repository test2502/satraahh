import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const goToPosition = () => {
    navigate("/choose-position");
  };

  const goToIdeas = () => {
    navigate("/get-ideas");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
        Welcome!
      </h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center items-center">
        {/* Card 1 */}
        <div
          onClick={goToPosition}
          className="relative bg-[url('/src/assets/picIdeas/img3.jpg')] bg-cover bg-center h-[300px] w-full sm:w-[90%] md:w-[400px] rounded-xl shadow-md cursor-pointer hover:shadow-lg transition duration-300 overflow-hidden"
        >
          <div
            style={{
              backdropFilter: "blur(2.5px)",
              WebkitBackdropFilter: "blur(7px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
            className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              Choose a Position
            </h2>
            <p className="text-gray-200">Pick a pose or camera angle idea.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={goToIdeas}
          className="relative bg-[url('/src/assets/picIdeas/img3.jpg')] bg-cover bg-center h-[300px] w-full sm:w-[90%] md:w-[400px] rounded-xl shadow-md cursor-pointer hover:shadow-lg transition duration-300 overflow-hidden"
        >
          <div
            style={{
              backdropFilter: "blur(2.5px)",
              WebkitBackdropFilter: "blur(7px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
            className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              Get Picture Ideas
            </h2>
            <p className="text-gray-200">Inspiration for your next shoot!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
