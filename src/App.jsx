import "./App.css";
import DashBoardComp from "./components/dashboard-comp/DashboardComp";
import LandingPage from "./components/landing-page";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ import this
import { Provider } from "react-redux";
import appStore from "./utils/appStore";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashBoardComp />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <>
    <Provider store={appStore}>
      <RouterProvider router={appRouter}>
        <Outlet />
      </RouterProvider>
      </Provider>
    </>
  );
}

export default App;
