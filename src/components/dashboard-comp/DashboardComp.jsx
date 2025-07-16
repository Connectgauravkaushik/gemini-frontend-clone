import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatWindow from "../chat-comp/ChatWindow";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveChatUser,
  setCreateModalOpen,
  setDarkMode,
  setShowSidebar,
  setUserDropdownOpen,
} from "../../utils/userSlice";

const DashBoardComp = () => {
  const [tab, setTab] = useState("Users");
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

    const navigate = useNavigate();
  const dispatch = useDispatch();

  const isCreateModalOpen = useSelector((store) => store.user.showModal);
  const showSidebar = useSelector((store) => store.user.showSidebar);
  const userDropdownOpen = useSelector((store) => store.user.userDropdownOpen);
  const activeChatUser = useSelector((store) => store.user.activeChatUser);
  const darkMode = useSelector((store) => store.user.darkMode);

  // Search state for debounced search
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);



  useEffect(() => {
    setUsers(["Alice", "Bob", "Charlie"]);
  }, []);

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter users based on debounced search term
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      );
    }
  }, [debouncedSearchTerm, users]);

  const notify = (msg, type = "success") => toast(msg, { type });

  const handleCreateUser = () => {
    const trimmed = newUserName.trim();
    if (!trimmed) {
      notify("Username cannot be empty", "error");
      return;
    }
    if (users.includes(trimmed)) {
      notify("User already exists", "error");
      return;
    }
    setUsers((prevUsers) => [...prevUsers, trimmed]);
    notify(`New user ${trimmed} created`);
    setNewUserName("");
    dispatch(setCreateModalOpen(false));
    setTab("Users");
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u !== userToDelete));
      if (activeChatUser === userToDelete) dispatch(setActiveChatUser(null));
      notify(`User ${userToDelete} deleted`, "error");
      setUserToDelete(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    notify("Logged out successfully", "info");
    navigate("/");
  };

  const isDark = darkMode === "dark";

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 relative  ${
        isDark ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Hamburger button for mobile */}
      <button
        onClick={() => dispatch(setShowSidebar(!showSidebar))}
        className={
          showSidebar
            ? "md:hidden absolute top-5 left-48 z-50 p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            : "md:hidden absolute top-2 left-4 z-50 p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        }
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 top-0 left-0 h-screen w-64 p-6 flex flex-col justify-between transition-transform duration-300 
        
          ${
            showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${
          isDark
            ? "bg-gray-900 text-white"
            : "bg-white border-r border-gray-200 text-gray-900"
        }`}
      >
        <div>
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Create User */}
          <button
            onClick={() => dispatch(setCreateModalOpen(true))}
            className="mb-6 w-full bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 text-white"
          >
            + Create User
          </button>

          {/* Toggle Users */}
          <button
            onClick={() => dispatch(setUserDropdownOpen(!userDropdownOpen))}
            className={`w-full flex items-center justify-between mb-2 px-4 py-2 rounded transition ${
              tab === "Users"
                ? "bg-blue-600 text-white"
                : isDark
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>Users</span>
            {userDropdownOpen ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {/* Search Input */}
          {userDropdownOpen && (
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full mb-3 p-2 rounded border focus:outline-none ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-black placeholder-gray-500"
              }`}
            />
          )}

          {/* User List */}
          {userDropdownOpen && (
            <ul className="ml-4 max-h-[calc(100vh-260px)] overflow-y-auto">
              {filteredUsers.map((user, idx) => (
                <li
                  key={idx}
                  tabIndex={0} // make focusable
                  role="button" // treat as button for screen readers
                  onClick={() => {
                    dispatch(setActiveChatUser(user));
                    dispatch(setShowSidebar(false));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      dispatch(setActiveChatUser(user));
                      dispatch(setShowSidebar(false));
                    }
                  }}
                  className={`flex justify-between items-center text-sm py-1 rounded px-2 cursor-pointer ${
                    isDark
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{user}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserToDelete(user);
                    }}
                    className={`text-xs ${
                      isDark
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-500"
                    }`}
                    title="Delete User"
                    aria-label={`Delete user ${user}`}
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="mt-96 ">
          <button
            onClick={() =>
              darkMode === "dark"
                ? dispatch(setDarkMode("light"))
                : dispatch(setDarkMode("dark"))
            }
            className={`w-full flex items-center justify-between px-4 py-2 rounded-md font-medium transition duration-200 shadow-sm ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
            }`}
          >
            <span>{darkMode === "dark" ? "Light Mode" : "Dark Mode"}</span>
            <span className="text-xl">{darkMode === "dark" ? "🌙" : "☀️"}</span>
          </button>
        </div>

        {/* Logout */}
        <div className="pt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 px-4 py-2 rounded hover:bg-red-500 text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => dispatch(setShowSidebar(false))}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {activeChatUser ? (
          <div className="flex-1 flex flex-col min-h-0">
            <ChatWindow />
          </div>
        ) : (
          <div
            className={`flex-grow flex items-center justify-center text-xl ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Select a user to start chatting
          </div>
        )}
      </main>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div
            className={`p-6 rounded-xl w-full max-w-sm transition-colors duration-300 ${
              isDark ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Create New User</h2>
            <input
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter user name"
              className={`w-full p-2 rounded mb-4 focus:outline-none ${
                isDark
                  ? "bg-gray-800 text-white placeholder-gray-400"
                  : "bg-gray-100 text-black placeholder-gray-500"
              }`}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => dispatch(setCreateModalOpen(false))}
                className={`px-4 py-2 rounded ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div
            className={`p-6 rounded-xl w-full max-w-sm transition-colors duration-300 ${
              isDark ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Delete User</h2>
            <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Are you sure you want to delete <strong>{userToDelete}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setUserToDelete(null)}
                className={`px-4 py-2 rounded ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
};

export default DashBoardComp;
