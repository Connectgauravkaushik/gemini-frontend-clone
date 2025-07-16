import FormComponent from "./Form-component/form";

const LandingPage = () => {
  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white overflow-hidden">
      <div className="text-6xl sm:text-7xl md:text-8xl font-extrabold flex items-center gap-4 transition-opacity duration-1000">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 48 48"
          className="text-5xl md:text-6xl animate-bounce"
        >
          <linearGradient
            id="8sl3bbNtWcumaCBCPc4S6a_rnK88i9FvAFO_gr1"
            x1="3.906"
            x2="45.428"
            y1="3.906"
            y2="45.428"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stop-color="#ca5df5"></stop>
            <stop offset=".036" stop-color="#c05ff4"></stop>
            <stop offset=".293" stop-color="#806cea"></stop>
            <stop offset=".528" stop-color="#4d77e3"></stop>
            <stop offset=".731" stop-color="#297fdd"></stop>
            <stop offset=".895" stop-color="#1283da"></stop>
            <stop offset="1" stop-color="#0a85d9"></stop>
          </linearGradient>
          <path
            fill="url(#8sl3bbNtWcumaCBCPc4S6a_rnK88i9FvAFO_gr1)"
            d="M46.117,23.081l-0.995-0.04H45.12C34.243,22.613,25.387,13.757,24.959,2.88l-0.04-0.996	C24.9,1.39,24.494,1,24,1s-0.9,0.39-0.919,0.883l-0.04,0.996c-0.429,10.877-9.285,19.733-20.163,20.162l-0.995,0.04	C1.39,23.1,1,23.506,1,24s0.39,0.9,0.884,0.919l0.995,0.039c10.877,0.43,19.733,9.286,20.162,20.163l0.04,0.996	C23.1,46.61,23.506,47,24,47s0.9-0.39,0.919-0.883l0.04-0.996c0.429-10.877,9.285-19.733,20.162-20.163l0.995-0.039	C46.61,24.9,47,24.494,47,24S46.61,23.1,46.117,23.081z"
          ></path>
        </svg>
        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
          GEMINI
        </span>
      </div>

      <p className="mt-3 ml-28 text-base sm:text-lg text-gray-400 md:text-xl">
        Meet Gemini, your personal AI assistant
      </p>

      <FormComponent/>
    </div>
  );
};

export default LandingPage;
