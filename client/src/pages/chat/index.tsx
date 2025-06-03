import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  // We will redirect the user to profile page if the they don't have their profile set
  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return <div>Chat</div>;
};
