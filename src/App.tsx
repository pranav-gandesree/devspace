import AuthLayout from "./_auth/AuthLayout";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import RootLayout from "./_root/RootLayout";
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from "./_root/pages";
import "./globals.css";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { UsersProvider } from "./context/UsersContext";


const App = () => {
  return (
    <main className="flex h-screen">
      <UsersProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="sign-in" element={<SigninForm />}></Route>
            <Route path="sign-up" element={<SignupForm />}></Route>
          </Route>

          {/* Private Routes */}
          <Route element={<RootLayout />}>
            <Route index element={<Home />}></Route>
            <Route path="/explore" element={<Explore />} />
            <Route path="/saved" element={<Saved />} />  
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:id" element={<EditPost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/profile/:userId/*" element={<Profile />} />
            <Route path="/update-profile/:id" element={<UpdateProfile />} />
          </Route>
        </Routes>

        <Toaster />
      </UsersProvider>
    </main>
  );
};

export default App;
