"use client"
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthState {
  isAuthenticated: boolean;
  role: "user" | "lawyer" | null;
  email: string | null;
}

const Navbar: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    email: null,
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = (): void => {
      
      const role = localStorage.getItem('role')
      const email = localStorage.getItem('email')
      const isAuthenticated = !!(role && email);

      setAuthState({
        isAuthenticated,
        role: role?.toLowerCase() as "user" | "lawyer" | null,
        email,
      });
    };

    checkAuth();
  }, []);

  const clearAuth = (): void => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      localStorage.removeItem("adminData")
      localStorage.removeItem("adminId")
      localStorage.removeItem("adminToken");
      localStorage.removeItem("theme")
 
      console.log("Auth data cleared from localStorage");
    } catch (error) {
      console.error("Failed to clear authentication data:", error);
    }
  };

  const handleLogin = (): void => {
    router.push("/login");
  };

  const handleLogout = (): void => {
    clearAuth();
    setAuthState({ isAuthenticated: false, role: null, email: null });
    router.push("/");
  };

  const handleSignUp = (): void => {
    router.push("/register");
  };

  const handleDashboard = (): void => {
    if (authState.role === "user") {
      router.push("/dashboard/user");
    } else if (authState.role === "lawyer") {
      router.push("/dashboard/lawyer");
    }
  };

  const navLinks = [
    { href: "#analysis", label: "Features" },
    { href: "#flowchart", label: "Flowcharts" },
    { href: "#features", label: "About" },
  ];

  return (
    <nav className="w-full bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 fixed top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo (Left) */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Vesper AI
          </span>
        </div>

        {/* Centered navLinks */}
        <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-200 relative group text-sm tracking-wide"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Auth Buttons (Right) */}
        <div className="hidden md:flex items-center space-x-4">
          {authState.isAuthenticated ? (
            <>
              <button
                onClick={handleDashboard}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-900/30 hover:shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5 text-sm"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="px-5 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 text-sm"
              >
                Login
              </button>
              <button
                onClick={handleSignUp}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold shadow-md shadow-blue-900/30 hover:shadow-lg hover:from-blue-500 hover:to-violet-500 transition-all duration-200 transform hover:-translate-y-0.5 text-sm"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-slate-300 hover:text-blue-400 p-2 rounded-lg hover:bg-slate-800 transition-all duration-300 relative"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <Menu
                className={`w-6 h-6 transition-all duration-300 ${
                  mobileOpen
                    ? "opacity-0 rotate-180 scale-75"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  mobileOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-180 scale-75"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 space-y-4 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-800 p-6 mx-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-slate-300 hover:text-blue-400 font-medium py-2 px-3 rounded-lg hover:bg-slate-800 transition-all duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col space-y-3 pt-4 border-t border-slate-800">
            {authState.isAuthenticated ? (
              <>
                <button
                  onClick={handleDashboard}
                  className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="w-full px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all duration-200"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold shadow-md hover:from-blue-500 hover:to-violet-500 transition-all duration-200"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
