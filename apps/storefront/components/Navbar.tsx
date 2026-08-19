"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n-navigation";
import Image from "next/image";
import { CART_UPDATED_EVENT, getCartItemCount } from "@/lib/cart";
import { useCart } from "@/contexts/CartContext";

export default function Navbar({ lightBg = false }: { lightBg?: boolean }) {
  const t = useTranslations('nav');
  const locale = useLocale();

  const navLinks = [
    { label: t('tienda'), href: "/tienda" },
    { label: t('ciencia'), href: "/ciencia" },
    { label: t('suscripciones'), href: "/suscripciones" },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { openCart } = useCart();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);

  // Rhode Skin Smart Scroll Header: Hides on scroll down, reveals on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setScrolled(true);
        if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 8) {
          setVisible(false); // Hide on scroll down
        } else if (lastScrollY.current - currentScrollY > 8) {
          setVisible(true); // Reveal on scroll up
        }
      } else {
        setScrolled(false);
        setVisible(true); // Always visible at top
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncCartCount = () => setCartCount(getCartItemCount());

    syncCartCount();
    window.addEventListener(CART_UPDATED_EVENT, syncCartCount);
    window.addEventListener("storage", syncCartCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  useEffect(() => {
    if (!accountOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const handleSignOut = async () => {
    closeMenus();
    await signOut({ redirectUrl: "/" });
  };

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: visible ? 0 : "-100%",
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
        scrolled || lightBg
          ? "bg-[#FAF8F5]/92 backdrop-blur-md border-[#E6E1D8] shadow-2xs"
          : "bg-[#FAF8F5]/80 backdrop-blur-md border-[#E6E1D8]/60"
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">

        {/* Left Logo (Brand Kit V2 — Open Sauce Sans 700/800, tracking -0.035em) */}
        <Link
          href="/"
          className="font-sans font-bold text-[24px] tracking-[-0.035em] text-[#0F0F0F] hover:opacity-85 transition-opacity lowercase"
        >
          novapatch
        </Link>

        {/* Center Nav Links (Brand Kit V2 — Open Sauce Sans 500, lowercase) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-sans font-medium tracking-[-0.01em] text-[#3A3A37] hover:text-[#0F0F0F] transition-colors lowercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label="Carrito"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E6E1D8] text-[12px] font-sans font-medium text-[#0F0F0F] bg-white hover:bg-[#F2EEE7] transition-colors shadow-2xs"
          >
            <ShoppingBag size={15} className="text-[#0F0F0F]" />
            <span>carrito</span>
            {cartCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0F0F0F] px-1 text-[10px] font-bold text-[#FAF8F5]">
                {cartCount}
              </span>
            )}
          </button>
          {/* Cuenta — UserButton si logueado, link a /sign-in si no */}
          <div className="hidden md:flex items-center">
            {isSignedIn ? (
              <div className="relative pl-1" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="flex items-center gap-1.5 rounded-full p-1 transition-all duration-200 focus:outline-none cursor-pointer"
                >
                  <span className="relative h-9 w-9 overflow-hidden rounded-full border border-[#E6E1D8] bg-[#FAF8F5]">
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName ?? "Mi cuenta"}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[13px] font-sans font-bold text-[#0F0F0F]">
                        {user?.firstName?.[0] ?? "N"}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`text-[#0F0F0F] transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {accountOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-[calc(100%+12px)] w-[280px] overflow-hidden rounded-xl border border-[#E6E1D8] bg-white p-2 shadow-lg z-50"
                    >
                      <div className="border-b border-[#E6E1D8] px-3.5 py-3 flex items-center gap-3">
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#E6E1D8] bg-[#FAF8F5]">
                          {user?.imageUrl ? (
                            <Image
                              src={user.imageUrl}
                              alt={user.fullName ?? "Mi cuenta"}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-[14px] font-sans font-bold text-[#0F0F0F]">
                              {user?.firstName?.[0] ?? "N"}
                            </span>
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-sans font-semibold text-[#0F0F0F]">
                            {user?.fullName ?? "Mi cuenta"}
                          </p>
                          <p className="truncate text-xs font-mono text-[#A8A29A]">
                            {user?.primaryEmailAddress?.emailAddress ?? ""}
                          </p>
                        </div>
                      </div>

                      <div className="pt-1.5 pb-0.5 flex flex-col gap-0.5">
                        <Link
                          href="/cuenta"
                          onClick={closeMenus}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] transition-colors duration-150 hover:bg-[#FAF8F5]"
                        >
                          <User size={16} className="text-[#0F0F0F]" />
                          <span>{t('cuenta')}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] transition-colors duration-150 hover:bg-[#FAF8F5] cursor-pointer"
                        >
                          <LogOut size={16} className="text-[#0F0F0F]" />
                          <span>Cerrar sesión</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button
                  aria-label="Iniciar sesión"
                  className="p-2 rounded-full text-[#0F0F0F] hover:bg-[#F2EEE7] transition-all duration-200 cursor-pointer"
                >
                  <User size={20} className="text-[#0F0F0F]" />
                </button>
              </SignInButton>
            )}
          </div>

          <button
            aria-label="Menú"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-[#0F0F0F] hover:bg-[#F2EEE7] transition-colors duration-200 cursor-pointer"
          >
            {menuOpen ? <X size={22} className="text-[#0F0F0F]" /> : <Menu size={22} className="text-[#0F0F0F]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#FAF8F5] border-t border-[#E6E1D8] overflow-hidden"
          >
            <div className="px-8 py-6 flex flex-col gap-5">
              <nav aria-label="Menú principal">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-[15px] font-sans font-medium text-[#3A3A37] hover:text-[#0F0F0F] transition-colors py-1.5 lowercase"
                >
                  {link.label}
                </Link>
              ))}
              </nav>

              {/* Cuenta mobile */}
              <div className="pt-3 border-t border-[#E6E1D8]">
                {isSignedIn ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-10 w-10 overflow-hidden rounded-full bg-[#FAF8F5] border border-[#E6E1D8]">
                        {user?.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt={user.fullName ?? "Mi cuenta"}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[14px] font-sans font-bold text-[#0F0F0F]">
                            {user?.firstName?.[0] ?? "N"}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-sans font-semibold text-[#0F0F0F]">
                          {user?.fullName ?? "Mi cuenta"}
                        </p>
                        <p className="truncate text-xs font-mono text-[#A8A29A]">
                          {user?.primaryEmailAddress?.emailAddress ?? ""}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/cuenta"
                      onClick={closeMenus}
                      className="flex items-center gap-3 text-xs font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] transition-colors py-1"
                    >
                      <User size={16} className="text-[#0F0F0F]" />
                      <span>{t('cuenta')}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-3 text-xs font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] transition-colors py-1 cursor-pointer"
                    >
                      <LogOut size={16} className="text-[#0F0F0F]" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 text-xs font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] transition-colors py-1 cursor-pointer"
                    >
                      <User size={16} className="text-[#0F0F0F]" />
                      <span>{t('signIn')}</span>
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
