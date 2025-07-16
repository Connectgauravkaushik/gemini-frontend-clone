import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessageSkeleton from "./MessageSkeleton";
import { useSelector } from "react-redux";

const AiIcon = () => (
  <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2a1 1 0 011 1v1.07a8.001 8.001 0 016.93 6.93H21a1 1 0 110 2h-1.07a8.001 8.001 0 01-6.93 6.93V21a1 1 0 11-2 0v-1.07a8.001 8.001 0 01-6.93-6.93H3a1 1 0 110-2h1.07a8.001 8.001 0 016.93-6.93V3a1 1 0 011-1zm-3 9a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
  </svg>
);

const MessageList = ({ messages, isTyping, loading, onLoadMore, loadingMore, hasMore }) => {
  const theme = useSelector((store) => store.user.darkMode);
  const isDark = theme === "dark";

  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll to bottom when messages change, or adjust scroll after loading more
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (isAtBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isTyping, isAtBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    // Detect near top for loading older messages
    if (el.scrollTop < 50 && hasMore && !loadingMore) {
      onLoadMore && onLoadMore();
    }

    // Detect near bottom for scroll position tracking
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setIsAtBottom(nearBottom);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied!");
    } catch {
      toast.error("Failed to copy message.");
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex flex-col overflow-y-auto h-full p-4 space-y-4"
    >
      {loading &&
        [...Array(5)].map((_, i) => (
          <MessageSkeleton key={i} align={i % 2 === 0 ? "left" : "right"} />
        ))}

      {!loading &&
        messages.map((msg, i) => {
          const isUser = msg.from === "me";
          const isGemini = msg.from === "gemini";

          return (
            <div key={i} className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && isGemini && (
                <div className="mr-2">
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <AiIcon />
                  </div>
                </div>
              )}
              <div
                className={`group max-w-xs px-4 py-2 rounded-lg transition-all ${
                  isUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                }`}
              >
                {msg.type === "image" ? (
                  <img src={msg.content} alt="upload" className="rounded max-w-full" />
                ) : (
                  <div className="break-words">{msg.content}</div>
                )}
                <div
                  className={`text-xs mt-1 flex items-center space-x-2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.type !== "image" && (
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                      title="Copy message"
                    >
                      📋
                    </button>
                  )}
                </div>
              </div>
              {isUser && (
                <div className="ml-2">
                  <img src="https://i.pravatar.cc/40" alt="User" className="w-8 h-8 rounded-full" />
                </div>
              )}
            </div>
          );
        })}

      {/* Spinner and end message */}
      {loadingMore && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 my-2">
          🔄 Loading older messages...
        </div>
      )}
      {!hasMore && !loadingMore && (
        <div className="text-center text-sm text-gray-400 italic my-2">
          🚫 No more messages to load
        </div>
      )}

      {isTyping && (
        <div className="flex justify-end items-center space-x-2 text-sm italic text-gray-600 dark:text-gray-400">
          <span>User is typing...</span>
          <img src="https://i.pravatar.cc/40" alt="User" className="w-7 h-7 rounded-full" />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default MessageList;
