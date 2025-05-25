
import { Link } from "react-router-dom";
import { FaRocket, FaTwitter, FaDiscord, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <section className="relative border-t border-blue-500/30 bg-gradient-to-b from-blue-900/60 to-gray-900/80 py-10 shadow-lg shadow-blue-500/10 backdrop-blur-sm">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <FaRocket className="mr-2 text-3xl text-[#199cfa] drop-shadow-[0_0_5px_rgba(94,231,223,0.6)]" />
                <span className="bg-[#199cfa] bg-clip-text text-2xl font-bold tracking-wider text-transparent">
                  BidSpace
                </span>
              </div>
              <p className="mb-8 text-sm text-blue-300/80">
                Your gateway to the universe of digital auctions. Explore, bid,
                and conquer the space economy.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-blue-400 transition-colors hover:text-cyan-400"
                >
                  <FaTwitter size={20} />
                </Link>
                <Link
                  to="/"
                  className="text-blue-400 transition-colors hover:text-cyan-400"
                >
                  <FaDiscord size={20} />
                </Link>
                <Link
                  to="/"
                  className="text-blue-400 transition-colors hover:text-cyan-400"
                >
                  <FaGithub size={20} />
                </Link>
              </div>
              <div className="mt-8">
                <p className="text-sm text-blue-300/60">
                  &copy; {new Date().getFullYear()} BidSpace. All Rights
                  Reserved.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="mb-5 text-sm font-semibold tracking-wider text-[#199cfa] uppercase">
                Explore
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/marketplace"
                  >
                    Marketplace
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/categories"
                  >
                    Categories
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/trending"
                  >
                    Trending
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/how-it-works"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="mb-5 text-sm font-semibold tracking-wider text-[#199cfa] uppercase">
                Support
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/help"
                  >
                    Help Center
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/faq"
                  >
                    FAQ
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/report"
                  >
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="mb-5 text-sm font-semibold tracking-wider text-[#199cfa] uppercase">
                Legal
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/terms"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/privacy"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-blue-300 transition duration-200 hover:text-cyan-300"
                    to="/cookies"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Optional star-like particles effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 5 + 2}s infinite alternate`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Footer;
