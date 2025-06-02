import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/auth";
import { Profile } from "./pages/profile";
import { Chat } from "./pages/chat";
import { useAppStore } from "./store";

// Will navigate the user to auth page if the userInfo state is null/undefined
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// Will navigate the user to /chat page if the userInfo state is set
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
