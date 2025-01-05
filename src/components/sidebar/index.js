"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  FaRegUserCircle,
  FaUsers,
  FaShoppingBag,
  FaUserCog,
  FaSearch,
} from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";

// Admin menu items
const adminMenu = [
  { name: "Admin Dashboard", path: "/admin/dashboard", icon: MdDashboard },
  { name: "Daily Sales", path: "/dashboard/daily-sales", icon: FaUsers },
  {
    name: "Inventory Management",
    path: "/dashboard/inventory-management",
    icon: FaShoppingBag,
  },
  { name: "Settings", path: "/admin/settings", icon: FaUserCog },
];

// User menu items
const userMenu = [
  { name: "Dashboard", path: "/dashboard", icon: MdDashboard },
  { name: "Products", path: "/products", icon: FaShoppingBag },
  { name: "Profile", path: "/profile", icon: FaRegUserCircle },
];

const MenuLink = ({ item, currentPath }) => {
  const isActive = currentPath === item.path;
  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      className={`flex items-center px-4 py-2 mt-5 transition-colors duration-300 transform rounded-md ${
        isActive
          ? "bg-white text-primary"
          : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-white"}`} />
      <span className="mx-4 font-medium">{item.name}</span>
    </Link>
  );
};

const Sidebar = ({ onClose, isOpen }) => {
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
          setUserData(data.user);
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full px-3 py-4 bg-primary">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  const menuItems = userRole === "admin" ? adminMenu : userMenu;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed lg:relative z-50 w-64 h-screen bg-primary transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4">
            <Link href="/">
              <span className="text-lg font-bold text-white">BGS Sales</span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden text-white p-2 hover:bg-primary-dark rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="relative mt-6 px-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="w-5 h-5 text-white" />
            </span>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 text-gray-300 bg-gray-900 border rounded-md border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              placeholder="Search"
            />
          </div>

          <div className="flex flex-col flex-1 mt-6 px-4">
            <nav className="flex-1">
              {menuItems.map((item, index) => (
                <MenuLink key={index} item={item} currentPath={pathname} />
              ))}
            </nav>

            <div className="mt-auto mb-4">
              <hr className="my-6 border-gray-600" />
              <div className="px-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <FaRegUserCircle className="w-10 h-10 text-white" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-200">
                      {userData?.username || "User"}
                    </span>
                    <span className="text-sm text-gray-400">
                      {userData?.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-200 transition-colors duration-300 transform rounded-md hover:bg-gray-800"
                >
                  <MdLogout className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
