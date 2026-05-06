"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, User, LogOut, ClipboardList } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/store/cart";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handler = () => setIsUserMenuOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isUserMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/#contact", label: "Contact" },
  ];

  const firstName = user?.name?.split(" ")[0] || "Account";
  const isLoggedIn = !isLoading && !!user;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white transition-shadow duration-300",
        isScrolled
          ? "shadow-[0_2px_12px_0_rgba(0,0,0,0.10)] border-b border-[#E8E0DF]"
          : "border-b border-[#E8E0DF]"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-none group"
            aria-label="Cluck'n Coop'n — Home"
          >
            <span className="font-brand text-xl font-semibold text-[#8C1515] leading-tight group-hover:text-[#A01A1A] transition-colors">
              Cluck&apos;n
            </span>
            <span className="font-brand text-xl font-semibold text-[#8C1515] leading-tight group-hover:text-[#A01A1A] transition-colors">
              Coop&apos;n
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Auth + Cart + Mobile hamburger */}
          <div className="flex items-center gap-2">
            {/* Auth — desktop only */}
            <div className="hidden md:flex items-center">
              {isLoading ? null : isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen((p) => !p);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8C1515] text-white text-xs font-bold">
                      {firstName.charAt(0).toUpperCase()}
                    </span>
                    <span>{firstName}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white border border-[#E8E0DF] shadow-lg py-1 z-50">
                      <Link
                        href="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1C1C1C] hover:bg-[#FFF0F0] hover:text-[#8C1515] transition-colors"
                      >
                        <ClipboardList className="h-4 w-4" />
                        My Orders
                      </Link>
                      <button
                        onClick={() => { setIsUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1C1C1C] hover:bg-[#FFF0F0] hover:text-[#8C1515] transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>

            {/* Cart */}
            <CartDrawer>
              <button
                className="relative flex items-center justify-center h-10 w-10 rounded-xl text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C1515]"
                aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#8C1515] text-white text-[10px] font-bold leading-none">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            </CartDrawer>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C1515]"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E0DF] py-3 pb-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200"
                  >
                    <ClipboardList className="h-4 w-4" />
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out ({firstName})
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#1C1C1C] hover:text-[#8C1515] hover:bg-[#FFF0F0] transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}

              <div className="mt-2 px-2">
                <CartDrawer>
                  <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShoppingCart className="h-4 w-4" />
                    View Cart
                    {totalItems > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#8C1515] text-[10px] font-bold">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </CartDrawer>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
