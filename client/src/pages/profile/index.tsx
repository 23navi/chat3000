import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { AxiosError } from "axios";
import { useAppStore } from "@/store";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  // add more fields based on your actual API response
}

export const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Note: userInfo will be null if the user refreshes the page.
  const { userInfo } = useAppStore();

  console.log({ userInfo });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/api/users/me", {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          setError("Failed to load profile");
        }
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err?.response?.data?.message || "Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {user && (
        <div className="space-y-2">
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          {/* Add more profile fields as needed */}
        </div>
      )}
    </div>
  );
};
