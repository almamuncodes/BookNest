"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client"; // আপনার actual path অনুযায়ী adjust করুন

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Books" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-gray-900">
          <span className="text-[#2F6D4F]">📖</span> BookNest
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-[#2F6D4F] ${
                pathname === link.href ? "font-bold text-[#2F6D4F]" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-4 text-sm md:flex">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-gray-100" />
          ) : isLoggedIn ? (
            <>
              <Link href="/add-book" className="text-gray-600 hover:text-[#2F6D4F]">Add Book</Link>
              <Link href="/manage-books" className="text-gray-600 hover:text-[#2F6D4F]">Manage Books</Link>
              <button onClick={handleLogout} className="rounded-full border bg-orange-400 border-gray-200 px-4 py-1.5 font-semibold text-gray-900 hover:bg-orange-500">
                Logout
              </button>
            </>
          ) : (
            <Link href="/signin" className="rounded-full bg-[#ff8904] px-4 py-1.5 font-semibold text-white hover:bg-orange-500">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="block text-2xl text-gray-900 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-gray-200 bg-white p-5 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-medium ${pathname === link.href ? "text-[#2F6D4F]" : "text-gray-600"}`}
            >
              {link.label}
            </Link>
          ))}
          {isPending ? null : isLoggedIn ? (
            <>
              <Link href="/add-book" onClick={() => setMenuOpen(false)} className="text-gray-600">Add Book</Link>
              <Link href="/manage-books" onClick={() => setMenuOpen(false)} className="text-gray-600">Manage Books</Link>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="text-left font-semibold text-[#2F6D4F]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/signin" onClick={() => setMenuOpen(false)} className="font-semibold text-[#ff8904]">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}