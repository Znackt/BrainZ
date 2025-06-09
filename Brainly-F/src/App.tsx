import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashBoard from "./Pages/Dashboard";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import SharePage from "./Pages/SharePage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="/api/v1/brain/:shareLink" element={<SharePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
