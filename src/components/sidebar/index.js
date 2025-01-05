"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";
import { FaUsers, FaShoppingBag, FaUserCog } from "react-icons/fa";

// Admin menu items remain the same
const adminMenu = [
  { name: "Admin Dashboard", path: "/admin/dashboard", icon: MdDashboard },
  { name: "User Management", path: "/admin/users", icon: FaUsers },
  {
    name: "Inventory Management",
    path: "/dashboard/inventory-management",
    icon: FaShoppingBag,
  },
  { name: "Settings", path: "/admin/settings", icon: FaUserCog },
];

// User menu items remain the same
const userMenu = [
  { name: "Dashboard", path: "/dashboard", icon: MdDashboard },
  { name: "Products", path: "/products", icon: FaShoppingBag },
  { name: "Profile", path: "/profile", icon: FaRegUserCircle },
];

const MenuLink = ({ item, pathname }) => {
  const isActive = pathname === item.path;
  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      className={`flex items-center px-4 py-2 mt-5 transition-colors duration-300 transform rounded-md ${
        isActive
          ? "bg-primary text-white hover:bg-primary-700"
          : "text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <Icon
        className={`w-5 h-5 ${
          isActive
            ? "text-white"
            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
        }`}
      />
      <span className="mx-4 font-medium">{item.name}</span>
    </Link>
  );
};

export default function Sidebar() {
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef(null);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

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
      <div className="h-full px-3 py-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  const menuItems = userRole === "admin" ? adminMenu : userMenu;

  return (
    <aside
      ref={sidebarRef}
      className={`h-[calc(100vh-64px)] lg:h-full lg:static z-40 w-64 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <MenuLink key={index} item={item} pathname={pathname} />
            ))}
          </nav>

          <div className="mt-6">
            <hr className="my-6 border-gray-200 dark:border-gray-600" />

            <div className="px-4 space-y-3">
              <div className="flex items-center space-x-3">
                <FaRegUserCircle className="w-10 h-10 text-gray-900 dark:text-white" />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    {userData?.username || "User"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {userData?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-900 transition-colors duration-300 transform rounded-md dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MdLogout className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
