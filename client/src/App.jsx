import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import MainLayout from "./components/MainLayout";
import { serviceAxiosInstance } from "./config/axios";
import About from "./components/About";
import ProtectedRoute from "./components/ProtectedRoute";


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />
  },
  {
    path: "/chat/:thread_id",
    element: <ProtectedRoute><ChatPage /></ProtectedRoute>
  },
  {
    path: "/new",
    element: <ProtectedRoute><ChatPage/></ProtectedRoute>
  },
  {
    path: '/about',
    element: <About/>
  }
  
]);

const App = () => {
  useEffect(() => {
    console.log("refreshtoken hit");
    async function handleTokenLife() {
      const res = await serviceAxiosInstance.post("/refresh-token");
      console.log("res", res);
    }
    handleTokenLife();
  }, []);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
};

export default App;
