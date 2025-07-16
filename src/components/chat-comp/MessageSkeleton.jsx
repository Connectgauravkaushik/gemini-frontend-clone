const MessageSkeleton = ({ align = "left" }) => {
  const isLeft = align === "left";

  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"} w-full`}>
      <div
        className={`flex items-start space-x-3 ${
          isLeft ? "" : "flex-row-reverse space-x-reverse"
        }`}
      >
        {/* Avatar Circle */}
        <div className="w-6 h-9 rounded-full bg-gray-600 animate-pulse shadow-md" />

        {/* Message Bubble */}
        <div
          className={`p-4 rounded-xl max-w-xs animate-pulse space-y-3
            ${isLeft ? "bg-gray-700 w-72 h-24" : "bg-blue-600 w-72 h-24"}`}
          style={{ boxShadow: isLeft 
            ? "0 1px 3px rgba(0,0,0,0.3)" 
            : "0 1px 6px rgba(59, 130, 246, 0.6)" }}
        >
          {/* Skeleton text lines with varied widths for realism */}
          <div className="h-3 rounded-full bg-gray-600 w-11/12"></div>
          <div className="h-3 rounded-full bg-gray-600 w-9/12"></div>
          <div className="h-3 rounded-full bg-gray-600 w-7/12"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;

