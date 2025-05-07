import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";

const RootLayout = () => {
  const { user } = useUserContext();

  // If user is not authenticated, redirect to sign-in
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />
      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
      <Bottombar/>
    </div>
  );
};

export default RootLayout;
