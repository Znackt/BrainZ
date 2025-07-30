import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashBoard from "./Pages/Dashboard";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import SharePage from "./Pages/SharePage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          } />
          <Route path="/api/v1/brain/:shareLink" element={<SharePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
