import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MessageInput = ({ onSend, disabled, placeholder }) => {
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);
  const theme = useSelector((store) => store.user.darkMode);
  const isDark = theme === "dark";

  const handleSend = () => {
    if (!input.trim()) return;
    onSend({ content: input.trim(), type: "text" });
    toast.success("Message sent!", { autoClose: 1000 });
    setInput("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onSend({ content: event.target.result, type: "image" });
      toast.success("Image sent!", { autoClose: 1000 });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <div
        className={`p-4 border-t flex flex-wrap gap-2 items-center transition-colors duration-200 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={placeholder}
          className={`flex-1 min-w-[150px] rounded px-3 py-2 focus:outline-none transition-colors duration-200 ${
            isDark
              ? "bg-gray-700 text-white placeholder-gray-400"
              : "bg-white text-black placeholder-gray-500"
          }`}
          disabled={disabled}
        />

        {/* Image Upload Button with Inline SVG */}
        <button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          disabled={disabled}
          title="Upload image"
          className={`p-2 rounded transition-colors duration-200 flex items-center justify-center ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"
          } ${isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm16 11l-4-4a1 1 0 00-1.414 0L9 17H5m14-6a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
          disabled={disabled}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled}
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"
          } ${isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}
        >
          Send
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={isDark ? "dark" : "light"}
      />
    </>
  );
};

export default MessageInput;
