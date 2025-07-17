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
  const isDark = darkMode === "dark";

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setUsers(["Alice", "Bob", "Charlie"]);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 relative ${
        isDark ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Hamburger for mobile */}
      <button
        onClick={() => dispatch(setShowSidebar(!showSidebar))}
        className="md:hidden absolute top-2 left-4 z-50 p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 top-0 left-0 h-screen w-64 flex flex-col transition-transform duration-300
          ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isDark ? "bg-gray-900 text-white" : "bg-white border-r border-gray-200 text-gray-900"}`}
      >
        {/* Scrollable top content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <button
            onClick={() => dispatch(setCreateModalOpen(true))}
            className="mb-6 w-full bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 text-white"
          >
            + Create User
          </button>

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
                d={userDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>

          {userDropdownOpen && (
            <>
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
              <ul className="ml-4 space-y-1 max-h-48 overflow-y-auto">
                {filteredUsers.map((user, idx) => (
                  <li
                    key={idx}
                    tabIndex={0}
                    role="button"
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
                    >
                      🗑
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Fixed bottom actions */}
        <div className="p-4 space-y-2 border-t border-gray-700">
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
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 px-4 py-2 rounded hover:bg-red-500 text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => dispatch(setShowSidebar(false))}
        />
      )}

      {/* Chat area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
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


      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div
            className={`p-6 rounded-xl w-full max-w-sm ${
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

      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div
            className={`p-6 rounded-xl w-full max-w-sm ${
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

      <ToastContainer position="top-right" autoClose={3000} theme={isDark ? "dark" : "light"} />
    </div>
  );
};

export default DashBoardComp;
