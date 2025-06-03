import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/auth";
import { Profile } from "./pages/profile";
import { Chat } from "./pages/chat";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import apiClient from "./lib/api-client";
import { GET_USERINFO_ROUTE } from "./lib/constants";
import { AxiosError } from "axios";

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
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);


  // Say user reloads the page or comes to this page and we find that the user still have an active jwt cookie, then we will trigger a /api/users/me request and it will send the cookie and if we get user profile, we don't have to make user login again.
  useEffect(() => {
    console.log("Running the useEffect() to set user info in App.tsx");
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USERINFO_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.user) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.message);
        }
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

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
