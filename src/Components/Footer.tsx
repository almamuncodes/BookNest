import Link from "next/link";

// ------------------- LINK GROUPS (all routes must actually exist in the app) -------------------
const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Browse Books" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/add-book", label: "Add Book" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/help", label: "Help / Support" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/mdalmamun.islam.7564", label: "Facebook", icon: "📘" },
  { href: "https://twitter.com", label: "Twitter / X", icon: "🐦" },
  { href: "https://instagram.com", label: "Instagram", icon: "📷" },
  { href: "https://github.com", label: "GitHub", icon: "💻" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="col-span-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-extrabold text-white"
          >
            <span className="text-2xl">📚</span>
            BookNest
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400 max-w-xs">
            A free home for readers and storytellers — share a book, discover
            a new one, and keep reading.
          </p>

          {/* Contact info */}
          <div className="mt-5 space-y-1.5 text-sm text-neutral-400">
            <p>📧 almamun2026islam@gmail.com</p>
            <p>📞 +880 1994810914</p>
            <p>📍 Mymensingh, Bangladesh</p>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Explore</h3>
          <ul className="space-y-2.5">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2.5">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2.5">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {year} BookNest. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-sm hover:bg-neutral-700 hover:-translate-y-1 transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}