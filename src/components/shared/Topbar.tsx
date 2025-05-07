// src/components/Topbar.tsx

import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";

const Topbar = () => {
  const { user, signOut } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in"); // Redirect to sign-in page if no user
    }
  }, [user, navigate]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <h1 className="text-2xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
            Work Hive
          </h1>
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={signOut}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          {user && (
            <Link to={`/profile/${user.id}`} className="flex-center gap-3">
              <img
                src={user.user_metadata?.avatar_url || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                className="h-8 w-8 rounded-full"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Topbar;
