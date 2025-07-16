import { useEffect, useState, useRef, useCallback } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChatUser } from "../../utils/userSlice";

const CHAT_STORAGE_KEY_PREFIX = "chat_messages_";
const MESSAGES_PER_PAGE = 20;
const MAX_MESSAGES = 100;
const AI_REPLY_DELAY = 2000;
const AI_THROTTLE_TIME = 4000;

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(MESSAGES_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const lastAiReplyTime = useRef(0);
  const messageListRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.activeChatUser);
  const theme = useSelector((store) => store.user.darkMode);
  const isDark = theme === "dark";

  // --- Initialize dummy data for test users ---
  useEffect(() => {
    const DUMMY_USERS = ["alice", "bob", "charlie"];
    const generateDummyMessages = (count) =>
      Array.from({ length: count }, (_, i) => ({
        content: `Initial dummy message #${i + 1}`,
        from: i % 2 === 0 ? "me" : "gemini",
        timestamp: Date.now() - (count - i) * 60000,
        type: "text",
      }));

    DUMMY_USERS.forEach((user) => {
      const key = CHAT_STORAGE_KEY_PREFIX + user;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(generateDummyMessages(30)));
      }
    });

    // Set default active user for testing
    dispatch(setActiveChatUser("alice"));
  }, [dispatch]);

  // Load messages for selected user
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const timer = setTimeout(() => {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY_PREFIX + user);
      const userMessages = saved ? JSON.parse(saved) : [];
      setMessages(userMessages);
      setVisibleCount(Math.min(MESSAGES_PER_PAGE, userMessages.length));
      setHasMoreMessages(userMessages.length < MAX_MESSAGES);
      setLoading(false);
      setIsTyping(false);
      setInputDisabled(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // Scroll to bottom on message change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const saveMessages = (msgs) => {
    if (!user) return;
    localStorage.setItem(CHAT_STORAGE_KEY_PREFIX + user, JSON.stringify(msgs));
  };

  const handleSendMessage = (msg) => {
    if (!msg.content || !user || (msg.type === "text" && !msg.content.trim())) return;

    const newMsg = {
      content: msg.content,
      from: "me",
      timestamp: Date.now(),
      type: msg.type || "text",
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(updated);

    const now = Date.now();
    if (now - lastAiReplyTime.current > AI_THROTTLE_TIME) {
      setInputDisabled(true);
      setIsTyping(true);

      setTimeout(() => {
        const aiReply = {
          content: msg.type === "image" ? "Nice image! 📷" : `Gemini echo: "${msg.content}"`,
          from: "gemini",
          timestamp: Date.now(),
          type: "text",
        };

        const finalList = [...updated, aiReply];
        setMessages(finalList);
        saveMessages(finalList);
        setIsTyping(false);
        setInputDisabled(false);
        lastAiReplyTime.current = Date.now();
      }, AI_REPLY_DELAY);
    }
  };

  // Simulate loading older messages on scroll top
  const handleLoadMore = useCallback(() => {
    if (!hasMoreMessages || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const currentCount = messages.length;
      const remaining = MAX_MESSAGES - currentCount;
      const toAdd = Math.min(MESSAGES_PER_PAGE, remaining);

      const dummyMessages = Array.from({ length: toAdd }, (_, i) => ({
        content: `Old dummy message #${currentCount + i + 1}`,
        from: (currentCount + i) % 2 === 0 ? "me" : "gemini",
        timestamp: Date.now() - (currentCount + i + 1) * 100000,
        type: "text",
      }));

      const newMessages = [...dummyMessages, ...messages];
      setMessages(newMessages);
      saveMessages(newMessages);
      setVisibleCount((prev) => prev + toAdd);
      setHasMoreMessages(newMessages.length < MAX_MESSAGES);
      setLoadingMore(false);
    }, 1000);
  }, [hasMoreMessages, loadingMore, messages]);

  const visibleMessages = messages.slice(-visibleCount);

  return (
    <div
      className={`flex flex-col h-full w-full ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}
      style={{ height: "100vh" }}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center px-4 py-3 border-b ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-300"
        }`}
      >
        <h3 className="font-semibold text-lg ml-10">{user}</h3>
        <button
          onClick={() => dispatch(setActiveChatUser(null))}
          className={`hover:text-red-500 ${isDark ? "text-gray-300" : "text-gray-600"}`}
          title="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Message List */}
      <div ref={messageListRef} className="flex-grow overflow-y-auto px-4 py-2 min-h-0">
        <MessageList
          messages={visibleMessages}
          isTyping={isTyping}
          loading={loading}
          onLoadMore={handleLoadMore}
          loadingMore={loadingMore}
          hasMore={hasMoreMessages}
        />
      </div>

      {/* Input */}
      <div
        className={`border-t px-4 py-3 sticky bottom-0 z-10 ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-300"
        }`}
      >
        <MessageInput onSend={handleSendMessage} disabled={inputDisabled || loading} placeholder={`Message ${user}...`} />
      </div>
    </div>
  );
};

export default ChatWindow;
