import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        showModal: false,
        showSidebar: false,
        userDropdownOpen: true,
        activeChatUser: null,
        darkMode: "dark"
    },
    reducers: {
        setCreateModalOpen: (state, action) => {
            state.showModal = action.payload;
        },
        setShowSidebar: (state, action) => {
            state.showSidebar = action.payload;
        },
        setUserDropdownOpen: (state, action) => {
            state.userDropdownOpen = action.payload;
        },
        setActiveChatUser: (state, action) => {
            state.activeChatUser = action.payload;
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
        },
    }
});

export const { setCreateModalOpen, setShowSidebar, setUserDropdownOpen, setActiveChatUser , setDarkMode} = userSlice.actions;
export default userSlice.reducer;