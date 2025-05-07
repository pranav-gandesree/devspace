import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase/SupabaseClient";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      setUser(null);
      navigate("/sign-in");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="leftsidebar bg-black text-white h-screen w-64 fixed top-0 left-0 flex flex-col justify-between px-5 py-10 overflow-y-auto">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-white tracking-wide">
          Dev Space
        </Link>

        {/* User Info */}
        {user && (
          <Link to={`/profile/${user.id}`} className="flex items-center gap-4">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="profile"
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-orange-500 flex items-center justify-center text-xl font-bold text-black">
                {getInitials(user?.user_metadata?.name || "User")}
              </div>
            )}
            <div className="flex flex-col">
              <p className="font-semibold">{user?.user_metadata?.name}</p>
            </div>
          </Link>
        )}

        {/* Navigation Links */}
        <ul className="flex flex-col gap-2">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`rounded-lg transition-colors ${
                  isActive ? "bg-purple-600" : "hover:bg-gray-800"
                }`}
              >
                <NavLink to={link.route} className="flex items-center gap-4 p-3">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`h-5 w-5 ${
                      isActive ? "filter invert" : "text-white"
                    }`}
                  />
                  <span className="text-sm font-medium">{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-3 text-white hover:bg-gray-800 w-full justify-start"
        onClick={handleLogout}
      >
        <img src="/assets/icons/logout.svg" alt="logout" className="h-5 w-5" />
        <span>Logout</span>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
