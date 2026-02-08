import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Journal from "./pages/Journal";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import ViewEntry from "./pages/ViewEntry";
import Intro from "./pages/Intro";



const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Intro />} />


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journal/view"
            element={
              <ProtectedRoute>
                <ViewEntry />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal/edit"
            element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
