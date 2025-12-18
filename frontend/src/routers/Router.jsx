import { Route, Routes } from "react-router-dom";
import Homepage from "../pages/homepage/HomePage";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import NotFoundPage from "../pages/common/NotFoundPage";

function Router() {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default Router;
