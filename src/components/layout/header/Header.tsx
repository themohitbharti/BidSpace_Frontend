import { useState } from "react";
import { ProfileSidebar } from "../../index";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRocket, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import NotificationDropdown from "../NotificationDropdown";

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authStatus = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  // Modern button styles
  const buttonBaseStyle =
    "inline-block px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm md:text-base duration-200 rounded-lg mx-0.5 sm:mx-1 text-white border border-opacity-30 transition-all font-medium bg-transparent";
  const buttonActiveStyle =
    "bg-blue-600/90 border-cyan-400 font-bold shadow-[0_0_12px_rgba(59,130,246,0.3)]";
  const buttonInactiveStyle =
    "bg-blue-900/30 border-blue-500/20 hover:bg-blue-800/40 hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]";

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Discover", slug: "/discover", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Create Auction", slug: "/upload-item", active: authStatus },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-blue-900 py-3 shadow-lg shadow-blue-500/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <div className="flex items-center">
            <FaRocket className="mr-2 text-3xl text-[#199cfa] drop-shadow-[0_0_5px_rgba(94,231,223,0.6)]" />
            <span className="bg-[#199cfa] bg-clip-text text-2xl font-bold tracking-wider text-transparent cursor-pointer"
              onClick={() => navigate("/")}
            >
              BidSpace
            </span>
          </div>
          <ul className="flex flex-wrap justify-end gap-1 sm:gap-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name} className="shrink-0">
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`group relative ${buttonBaseStyle} ${
                        location.pathname === item.slug
                          ? buttonActiveStyle
                          : buttonInactiveStyle
                      } overflow-hidden`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {/* Animated underline */}
                      <span
                        className={`
                          absolute left-0 bottom-0 h-0.5 w-full bg-blue-400
                          transition-transform duration-300
                          ${location.pathname === item.slug
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"}
                          origin-left
                        `}
                        style={{ pointerEvents: "none" }}
                      />
                    </button>
                  </li>
                ),
            )}

            {authStatus && (
              <>
                {/* Notification Dropdown */}
                <li className="shrink-0">
                  <NotificationDropdown />
                </li>
                {/* Professional Profile Button */}
                <li className="shrink-0">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-200 transition-all duration-300 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105"
                    title={`${user?.fullName || 'Profile'} - Click to open menu`}
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* User Avatar or Icon */}
                    <div className="relative z-10 flex items-center justify-center">
                      {user?.fullName ? (
                        // Show user initials
                        <span className="text-sm font-bold tracking-wide">
                          {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      ) : (
                        // Fallback to user icon
                        <FaUser className="text-base" />
                      )}
                    </div>
                    
                    {/* Subtle rotating border on hover */}
                    <div className="absolute inset-0 rounded-full border border-blue-400/0 group-hover:border-blue-400/20 transition-all duration-500 group-hover:rotate-180" />
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>

      {/* Sidebar */}
      <ProfileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
}

export default Header;
