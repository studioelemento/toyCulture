import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Tags,
  Award,
  FolderTree,
  ExternalLink,
  Search,
  Bell,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState("checking");

  useEffect(() => {
    fetch("/api/v1/products")
      .then((res) => {
        if (res.ok) setDbStatus("connected");
        else setDbStatus("error");
      })
      .catch(() => setDbStatus("error"));
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Products", path: "/products", icon: Package },
    { label: "Add Product", path: "/products/new", icon: PlusCircle },
    { label: "Categories", path: "/categories", icon: FolderTree },
    { label: "Brands", path: "/brands", icon: Award },
    { label: "Orders", path: "/orders", icon: ShoppingBag },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden lg:flex w-64 bg-[#0E1526]/90 backdrop-blur-xl border-r border-indigo-950/50 flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-40">
        <div>
          {/* Logo / Brand */}
          <div className="h-16 px-6 border-b border-indigo-950/40 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
                  Toy<span className="text-amber-400">Culture</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block">
                  Admin Workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-2">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active ? "text-indigo-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Database status & Store link */}
        <div className="p-4 border-t border-indigo-950/40 space-y-3">
          {/* PostgreSQL status */}
          <div className="bg-[#121A2F] border border-indigo-900/30 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus === "connected"
                    ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"
                    : dbStatus === "checking"
                    ? "bg-amber-400"
                    : "bg-rose-400"
                }`}
              />
              <span className="text-slate-300 font-medium">PostgreSQL</span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase ${
                dbStatus === "connected"
                  ? "text-emerald-400"
                  : dbStatus === "checking"
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {dbStatus === "connected" ? "Live DB" : dbStatus}
            </span>
          </div>

          {/* Quick link to Storefront */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-800/80 hover:from-slate-700 hover:to-slate-700/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 transition-all group"
          >
            <span>Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </a>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-[#0E1526] p-6 flex flex-col justify-between border-r border-indigo-950">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-indigo-950">
                <span className="font-extrabold text-lg text-white">
                  Toy<span className="text-amber-400">Culture</span> Admin
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                        active
                          ? "bg-indigo-600/30 text-white border border-indigo-500/40"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-indigo-400" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 rounded-xl py-3 text-xs font-bold text-slate-200"
            >
              <span>Customer Storefront</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-[#0E1526]/80 backdrop-blur-xl border-b border-indigo-950/40 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 lg:hidden text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 font-semibold capitalize">
                {location.pathname === "/"
                  ? "Dashboard"
                  : location.pathname.replace("/", "").replace("-", " ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products/new"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </Link>

            <a
              href="http://localhost:5173/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>Live Shop</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
