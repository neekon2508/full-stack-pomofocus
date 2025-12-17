import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/main-layout/MainLayout";
import Homepage from "../pages/homepage/HomePage";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import NotFoundPage from "../pages/common/NotFoundPage";

function Router() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
