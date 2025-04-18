import { useState } from "react";
import {ProfileSidebar} from "../index";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRocket, FaUserAstronaut } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authStatus = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();


  // Updated space theme button styles
  const buttonBaseStyle =
    "inline-block px-2 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 text-xs sm:text-sm md:text-base duration-200 rounded-full mx-0.5 sm:mx-1 text-white border border-opacity-30 transition-all";
  const buttonActiveStyle =
    "bg-blue-600 border-cyan-400 font-bold shadow-[0_0_12px_rgba(59,130,246,0.5)]";
  const buttonInactiveStyle =
    "bg-blue-900/40 border-blue-500/30 hover:bg-blue-800/60 hover:shadow-[0_0_8px_rgba(59,130,246,0.4)]";

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Categories", slug: "/categories", active: true },
    { name: "Trending", slug: "/trending", active: true },
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
            <span className="bg-[#199cfa] bg-clip-text text-2xl font-bold tracking-wider text-transparent">
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
                      className={`${buttonBaseStyle} ${
                        location.pathname === item.slug
                          ? buttonActiveStyle
                          : buttonInactiveStyle
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                ),
            )}

            {authStatus && (
              <li className="shrink-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-purple-300 transition-all hover:bg-purple-500/25 hover:shadow-[0_0_12px_rgba(180,144,202,0.4)]"
                >
                  <FaUserAstronaut />
                </button>
              </li>
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
