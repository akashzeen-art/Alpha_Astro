import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Home, Star, LayoutDashboard, User, Calculator, Hand,
  Info, FileText, RefreshCw, Shield, Phone, LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { path: "/", label: "Home", icon: Home },
  { path: "/numerology", label: "Numbers", icon: Calculator },
  { path: "/astrology", label: "Kundli", icon: Star },
  { path: "/palm-analysis", label: "Palm", icon: Hand },
  { path: "/dashboard", label: "Insights", icon: LayoutDashboard },
  { path: "/live-consultation", label: "Expert", icon: Phone },
];

const MORE_NAV = [
  { path: "/my-account", label: "My Account", icon: User },
  { path: "/about", label: "About", icon: Info },
  { path: "/contact", label: "Contact", icon: Phone },
  { path: "/terms", label: "Terms", icon: FileText },
  { path: "/refund-policy", label: "Refund", icon: RefreshCw },
  { path: "/privacy-policy", label: "Privacy", icon: Shield },
];

const DESKTOP_MORE = MORE_NAV.slice(0, 4);

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const handler = () => setIsAuthModalOpen(true);
    window.addEventListener("open-auth-modal", handler);
    return () => window.removeEventListener("open-auth-modal", handler);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[hsl(215_30%_4%/0.78)] backdrop-blur-xl safe-area-top">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex h-16 items-center gap-3 lg:gap-4">
            <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
              <img
                src={BRAND.LOGO}
                alt={BRAND.NAME}
                className="h-10 w-10 shrink-0 rounded-xl border border-teal-400/25 object-contain"
              />
              <div className="min-w-0 leading-tight">
                <p className="font-display truncate text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
                  {BRAND.NAME}
                </p>
                <p className="hidden max-w-[12rem] truncate text-[10px] text-slate-400/70 sm:block md:max-w-none">
                  {BRAND.TAGLINE}
                </p>
              </div>
            </Link>

            <nav
              className="hidden min-w-0 flex-1 items-center justify-center gap-1 px-2 lg:flex"
              aria-label="Main navigation"
            >
              <div className="no-scrollbar flex max-w-full items-center gap-0.5 overflow-x-auto">
                {PRIMARY_NAV.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "alpha-pill shrink-0",
                      isActive(item.path) && "alpha-pill-active"
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <span className="mx-2 h-4 w-px shrink-0 bg-white/10" aria-hidden />
              <div className="no-scrollbar flex items-center gap-0.5 overflow-x-auto">
                {DESKTOP_MORE.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "alpha-pill-subtle shrink-0",
                      isActive(item.path) && "alpha-pill-subtle-active"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="hidden h-9 w-9 text-slate-400 hover:bg-white/5 hover:text-rose-300 sm:flex"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDrawerOpen(true)}
                className="h-9 w-9 text-slate-200 hover:bg-white/5 hover:text-teal-200 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-[55]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <aside
            className="absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[hsl(215_28%_7%/0.96)] shadow-2xl lg:bottom-auto lg:left-auto lg:right-0 lg:top-16 lg:w-80 lg:max-h-[calc(100vh-4rem)] lg:rounded-none lg:rounded-bl-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <span className="font-display text-lg text-slate-100">Menu</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-teal-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3.5 text-sm transition-colors",
                    isActive(item.path)
                      ? "border-r-2 border-teal-400 bg-teal-400/10 text-teal-200"
                      : "text-slate-300/75 hover:bg-white/[0.03] hover:text-slate-100"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  {item.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
