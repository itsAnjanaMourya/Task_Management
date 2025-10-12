import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.js";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-900 to-indigo-900 shadow-lg z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a
              href={isAuthenticated ? "/home" : "/"}
              className="text-white text-xl font-bold tracking-wide hover:text-purple-200 transition-colors duration-200 no-underline"
            >
              📋 Task Management
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              ) : (
                <>
                  <a
                    href="/"
                    className="text-white hover:text-purple-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white hover:bg-opacity-10 no-underline"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg no-underline"
                  >
                    Register
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-purple-800 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`block h-6 w-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-purple-800 bg-opacity-50 rounded-lg mt-2 animate-in slide-in-from-top-2 duration-200">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-white hover:text-purple-200 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <a
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white hover:text-purple-200 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 no-underline"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white hover:text-purple-200 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 no-underline"
                  >
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

