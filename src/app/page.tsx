"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import {
  BookOpen,
  Code2,
  FlaskConical,
  Landmark,
  Sparkles,
  Feather,
  HeartHandshake,
  Star,
  ChevronDown,
  ArrowUpRight,
  Library,
  BrainCircuit,
  Compass,
  Users2,
  WifiOff,
  Quote,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ---------------------------------------------------------------------- */
/*  Fonts — Fraunces (literary display), Public Sans (body), Plex Mono    */
/*  (call-number / data utility face)                                     */
/* ---------------------------------------------------------------------- */
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

/* ---------------------------------------------------------------------- */
/*  Design tokens (kept local so this file can be dropped in as-is)       */
/* ---------------------------------------------------------------------- */
const COLORS = {
  paper: "#FBF9F4",
  shelf: "#F1ECE1",
  ink: "#1B2420",
  inkSoft: "#4B5850",
  forest: "#2F6D4F",
  forestDeep: "#1B4632",
  amber: "#FF8904",
  amberSoft: "#FFE9CC",
  gold: "#C89B3C",
  sage: "#E7EEE6",
  line: "#DCD4C2",
};

/* A "call number" eyebrow — riffs on library card-catalog tags instead of
   generic 01/02/03 numbering. */
function CallNumber({ code, label }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCD4C2] bg-white/70 px-3 py-1">
      <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[#2F6D4F]">
        {code}
      </span>
      <span className="h-3 w-px bg-[#DCD4C2]" />
      <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[#4B5850]">
        {label}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Dummy data                                                            */
/* ---------------------------------------------------------------------- */
const featuredBooks = [
  { title: "The Midnight Cartographer", author: "Elena Voss", genre: "Fantasy", rating: 4.8, color: "2F6D4F" },
  { title: "Signal & Noise", author: "Marcus Chen", genre: "Sci-Fi", rating: 4.6, color: "FF8904" },
  { title: "The Weight of Rivers", author: "Amara Odusanya", genre: "Literary Fiction", rating: 4.9, color: "C89B3C" },
  { title: "Ledger of Small Gods", author: "Petra Sundqvist", genre: "Mythology", rating: 4.7, color: "1B4632" },
  { title: "Field Notes on Silence", author: "Rohan Mehta", genre: "Essays", rating: 4.5, color: "8A6D3B" },
  { title: "The Clockmaker's Daughter", author: "Isla Fenwick", genre: "Historical", rating: 4.8, color: "5B7A63" },
];

const categories = [
  { name: "Novels", count: 3240, icon: BookOpen },
  { name: "Programming", count: 1180, icon: Code2 },
  { name: "Science", count: 960, icon: FlaskConical },
  { name: "History", count: 1420, icon: Landmark },
  { name: "Fantasy", count: 2085, icon: Sparkles },
  { name: "Poetry", count: 540, icon: Feather },
  { name: "Philosophy", count: 675, icon: BrainCircuit },
  { name: "Biography", count: 890, icon: Users2 },
];

const topRatedBooks = [
  { rank: 1, title: "The Weight of Rivers", author: "Amara Odusanya", rating: 4.9, reviews: 2840, callNo: "813.6 ODU" },
  { rank: 2, title: "The Midnight Cartographer", author: "Elena Voss", rating: 4.8, reviews: 3120, callNo: "813.6 VOS" },
  { rank: 3, title: "The Clockmaker's Daughter", author: "Isla Fenwick", rating: 4.8, reviews: 1950, callNo: "823.9 FEN" },
  { rank: 4, title: "Ledger of Small Gods", author: "Petra Sundqvist", rating: 4.7, reviews: 1610, callNo: "398.2 SUN" },
  { rank: 5, title: "Signal & Noise", author: "Marcus Chen", rating: 4.6, reviews: 2270, callNo: "813.6 CHE" },
];

const monthlyReading = [
  { month: "Jan", books: 4 },
  { month: "Feb", books: 6 },
  { month: "Mar", books: 5 },
  { month: "Apr", books: 8 },
  { month: "May", books: 7 },
  { month: "Jun", books: 9 },
  { month: "Jul", books: 6 },
  { month: "Aug", books: 10 },
  { month: "Sep", books: 8 },
  { month: "Oct", books: 11 },
  { month: "Nov", books: 9 },
  { month: "Dec", books: 12 },
];

const genreSplit = [
  { name: "Fiction", value: 34 },
  { name: "Sci-Fi & Fantasy", value: 22 },
  { name: "Non-Fiction", value: 18 },
  { name: "History", value: 14 },
  { name: "Poetry", value: 12 },
];
const PIE_COLORS = ["#2F6D4F", "#FF8904", "#C89B3C", "#5B7A63", "#8A6D3B"];

const whyChoose = [
  { icon: Library, title: "42,000+ titles", desc: "A shelf that spans genres, decades, and languages — curated, not just crawled." },
  { icon: Compass, title: "Recommendations that read you", desc: "Suggestions built from what you actually finish, not just what you click." },
  { icon: BrainCircuit, title: "Built-in reading tracker", desc: "Log pages, set yearly goals, and watch your streak without leaving the book." },
  { icon: Users2, title: "Reviews from real readers", desc: "No bots, no bought stars — every rating comes from a finished book." },
  { icon: WifiOff, title: "Offline-first reading", desc: "Download a title once, keep reading on a train, a flight, or a dead signal." },
  { icon: HeartHandshake, title: "Author-friendly royalties", desc: "A share of every membership goes directly to the authors you read." },
];

const testimonials = [
  { name: "Nadia Rahman", role: "Reads ~60 books/year", quote: "BookNest is the first tracker that didn't make reading feel like homework. My yearly stats page has become my favorite screen on my phone.", initials: "NR" },
  { name: "Tomasz Lindqvist", role: "Software Engineer", quote: "The programming category alone justified the subscription. Found three books here I'd never have stumbled on through a search engine.", initials: "TL" },
  { name: "Priya Deshmukh", role: "Book Club Organizer", quote: "We moved our entire club's reading list onto BookNest. The rating breakdowns start real conversations instead of just 'did you like it.'", initials: "PD" },
  { name: "Jonah Okafor", role: "Reads on commute", quote: "Offline mode is the whole reason I stayed. I lose signal on the subway every single day and never lose my place.", initials: "JO" },
];

const faqs = [
  { q: "Is BookNest free to use?", a: "Yes. The core library, reading tracker, and reviews are free. A paid membership unlocks offline downloads for the full catalog and early access to new releases." },
  { q: "Can I import my existing reading list?", a: "You can import from a CSV or connect a Goodreads export from Settings → Import. Your ratings and shelves carry over automatically." },
  { q: "Do authors get paid when I read their book?", a: "A portion of every membership fee is pooled and distributed to authors based on pages read, updated monthly." },
  { q: "Does the app work without an internet connection?", a: "Any title you've downloaded stays fully readable offline, including your highlights and notes, which sync once you're back online." },
  { q: "How is 'Top Rated' calculated?", a: "We weight a book's average rating against its number of completed reads, so a handful of five-star ratings can't outrank a widely-read favorite." },
];

/* ---------------------------------------------------------------------- */
/*  Scroll-reveal hook — respects prefers-reduced-motion                  */
/* ---------------------------------------------------------------------- */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ---------------------------------------------------------------------- */
/*  Per-genre cover illustrations — hand-drawn line motifs, no stock art, */
/*  so every "cover" is bespoke to its genre rather than a stock photo.   */
/* ---------------------------------------------------------------------- */
function CoverMotif({ genre }) {
  const common = { fill: "none", stroke: "rgba(255,255,255,0.55)", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };

  switch (genre) {
    case "Fantasy":
      // compass rose — cartographer's tool
      return (
        <g {...common}>
          <circle cx="60" cy="72" r="30" />
          <circle cx="60" cy="72" r="3" fill="rgba(255,255,255,0.6)" stroke="none" />
          <path d="M60 42 L65 72 L60 102 L55 72 Z" />
          <path d="M30 72 L60 67 L90 72 L60 77 Z" opacity="0.6" />
          <path d="M60 30 L60 42 M60 102 L60 114 M18 72 L30 72 M90 72 L102 72" />
        </g>
      );
    case "Sci-Fi":
      // transmission arcs — signal & noise
      return (
        <g {...common}>
          <circle cx="88" cy="46" r="3.5" fill="rgba(255,255,255,0.7)" stroke="none" />
          <path d="M76 58 A17 17 0 0 1 88 34" />
          <path d="M66 68 A31 31 0 0 1 88 22" opacity="0.7" />
          <path d="M56 78 A45 45 0 0 1 88 10" opacity="0.45" />
        </g>
      );
    case "Literary Fiction":
      // river — the weight of rivers
      return (
        <g {...common}>
          <path d="M14 60 C 40 50, 40 70, 66 60 S 92 50, 112 60" />
          <path d="M14 80 C 40 70, 40 90, 66 80 S 92 70, 112 80" opacity="0.6" />
          <path d="M14 100 C 40 90, 40 110, 66 100 S 92 90, 112 100" opacity="0.35" />
        </g>
      );
    case "Mythology":
      // radiating sun — ledger of small gods
      return (
        <g {...common}>
          <circle cx="60" cy="70" r="14" />
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const x1 = 60 + Math.cos(angle) * 20;
            const y1 = 70 + Math.sin(angle) * 20;
            const x2 = 60 + Math.cos(angle) * 32;
            const y2 = 70 + Math.sin(angle) * 32;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity={i % 2 ? 0.4 : 0.7} />;
          })}
        </g>
      );
    case "Essays":
      // ruled notebook lines with a folded corner
      return (
        <g {...common}>
          <path d="M20 40 H100" opacity="0.6" />
          <path d="M20 56 H100" opacity="0.5" />
          <path d="M20 72 H84" opacity="0.4" />
          <path d="M20 88 H100" opacity="0.5" />
          <path d="M20 104 H70" opacity="0.35" />
          <path d="M92 16 L108 16 L108 32 Z" opacity="0.5" />
        </g>
      );
    case "Historical":
      // clockmaker's face
      return (
        <g {...common}>
          <circle cx="60" cy="72" r="30" />
          <circle cx="60" cy="72" r="2.5" fill="rgba(255,255,255,0.7)" stroke="none" />
          <path d="M60 72 L60 52" />
          <path d="M60 72 L76 80" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x1 = 60 + Math.cos(angle) * 26;
            const y1 = 72 + Math.sin(angle) * 26;
            const x2 = 60 + Math.cos(angle) * 30;
            const y2 = 72 + Math.sin(angle) * 30;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.5" />;
          })}
        </g>
      );
    default:
      return null;
  }
}

/* Subtle paper-grain texture, generated (not a photo), reused across covers */
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")";

function BookCover({ title, color, genre }) {
  const initials = title
    .split(" ")
    .filter((w) => w.length > 2 || /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      className="relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded-md p-4 shadow-[0_10px_24px_-12px_rgba(27,36,32,0.45)] transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:rotate-[-1deg] group-hover:shadow-[0_18px_32px_-14px_rgba(27,36,32,0.55)]"
      style={{ backgroundColor: `#${color}` }}
    >
      {/* genre illustration, tucked behind the type */}
      <svg viewBox="0 0 120 144" className="pointer-events-none absolute inset-0 h-full w-full opacity-80 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
        <CoverMotif genre={genre} />
      </svg>

      {/* paper grain, for warmth rather than a flat color fill */}
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40" style={{ backgroundImage: GRAIN_BG }} />

      {/* hover shine sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-[160%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[160%]" />

      <div className="relative h-px w-8 bg-white/40" />
      <span className="relative font-[family-name:var(--font-display)] text-3xl italic text-white/90 [text-shadow:0_2px_6px_rgba(0,0,0,0.25)]">
        {initials}
      </span>
      <div className="relative h-px w-full bg-white/25" />
    </div>
  );
}

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={14} className="fill-[#C89B3C] text-[#C89B3C]" />
      <span className="font-[family-name:var(--font-mono)] text-xs text-[#4B5850]">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

/* A single Featured Book tile — owns its own scroll-reveal so the row      */
/* comes in as a staggered wave rather than all at once.                   */
function FeaturedBookCard({ book, index }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={`group cursor-pointer transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <BookCover title={book.title} color={book.color} genre={book.genre} />
      <p className="mt-3 font-[family-name:var(--font-display)] text-sm font-medium leading-snug transition-colors duration-200 group-hover:text-[#2F6D4F]">
        {book.title}
      </p>
      <p className="text-xs text-[#4B5850]">{book.author}</p>
      <div className="mt-1 flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[#4B5850]">
          {book.genre}
        </span>
        <StarRow rating={book.rating} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Page                                                                  */
/* ---------------------------------------------------------------------- */
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} bg-[#FBF9F4] font-[family-name:var(--font-body)] text-[#1B2420]`}
    >
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-[#DCD4C2]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div>
            <CallNumber code="020.1 BKN" label="Reading, cataloged" />
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.6rem,5.5vw,4.2rem)] font-medium leading-[1.04] tracking-tight">
              Every book you&apos;ll
              <br />
              <span className="italic text-[#2F6D4F]">ever love</span>, shelved
              <br />
              in one place.
            </h1>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-[#4B5850]">
              BookNest is a library, a tracker, and a reading room built into
              one shelf — 42,000+ titles, real reviews, and stats that show
              you exactly what kind of reader you are.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF8904] px-6 py-3 font-semibold text-white shadow-[0_8px_20px_-8px_rgba(255,137,4,0.7)] transition hover:bg-[#e57a00]"
              >
                Explore Books <ArrowUpRight size={17} />
              </Link>
              <span className="font-[family-name:var(--font-mono)] text-xs text-[#4B5850]">
                No card required · 42,318 titles live
              </span>
            </div>
          </div>

          {/* Signature visual: a bookshelf built from spines */}
          <div className="relative mx-auto flex h-[340px] w-full max-w-sm items-end justify-center gap-[6px] rounded-2xl bg-[#F1ECE1] px-6 pb-6 pt-10 shadow-inner">
            {[
              { h: "78%", c: "#2F6D4F" },
              { h: "92%", c: "#FF8904" },
              { h: "64%", c: "#1B4632" },
              { h: "85%", c: "#C89B3C" },
              { h: "70%", c: "#5B7A63" },
              { h: "95%", c: "#2F6D4F" },
              { h: "60%", c: "#8A6D3B" },
              { h: "88%", c: "#FF8904" },
              { h: "72%", c: "#1B4632" },
            ].map((spine, i) => (
              <div
                key={i}
                className="w-full rounded-t-sm transition-transform duration-300 hover:-translate-y-2"
                style={{ height: spine.h, backgroundColor: spine.c }}
              />
            ))}
            <div className="absolute -bottom-2 left-1/2 h-3 w-[88%] -translate-x-1/2 rounded-full bg-black/10 blur-sm" />
          </div>
        </div>
      </section>

      {/* ================= SEC 1 — FEATURED BOOKS ================= */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <CallNumber code="SEC.01" label="This week's shelf" />
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
              Featured Books
            </h2>
          </div>
          <Link href="/explore" className="text-sm font-semibold text-[#2F6D4F] hover:underline">
            View full catalog →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {featuredBooks.map((b, i) => (
            <FeaturedBookCard key={b.title} book={b} index={i} />
          ))}
        </div>
      </section>

      {/* ================= SEC 2 — CATEGORIES ================= */}
      <section className="border-y border-[#DCD4C2] bg-[#F1ECE1]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <CallNumber code="SEC.02" label="Browse by shelf" />
          <h2 className="mb-10 font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
            Book Categories
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((c) => (
              <div
                key={c.name}
                className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-[#DCD4C2] bg-[#FBF9F4] p-5 transition hover:border-[#2F6D4F] hover:shadow-[0_10px_24px_-14px_rgba(47,109,79,0.4)]"
              >
                <c.icon size={22} className="text-[#2F6D4F]" />
                <div>
                  <p className="font-[family-name:var(--font-display)] text-lg font-medium">{c.name}</p>
                  <p className="font-[family-name:var(--font-mono)] text-xs text-[#4B5850]">
                    {c.count.toLocaleString()} titles
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SEC 3 — TOP RATED ================= */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <CallNumber code="SEC.03" label="Ranked by readers" />
        <h2 className="mb-10 font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
          Top Rated Books
        </h2>
        <div className="divide-y divide-[#DCD4C2] rounded-2xl border border-[#DCD4C2] bg-white/60">
          {topRatedBooks.map((b) => (
            <div key={b.rank} className="flex items-center gap-5 px-5 py-4 sm:px-7">
              <span className="font-[family-name:var(--font-display)] text-2xl italic text-[#DCD4C2]">
                {String(b.rank).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="font-[family-name:var(--font-display)] text-base font-medium sm:text-lg">
                  {b.title}
                </p>
                <p className="text-xs text-[#4B5850] sm:text-sm">{b.author}</p>
              </div>
              <span className="hidden font-[family-name:var(--font-mono)] text-[11px] text-[#4B5850] sm:block">
                {b.callNo}
              </span>
              <span className="hidden font-[family-name:var(--font-mono)] text-xs text-[#4B5850] md:block">
                {b.reviews.toLocaleString()} reviews
              </span>
              <StarRow rating={b.rating} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= SEC 4 — READING STATISTICS ================= */}
      <section className="border-y border-[#DCD4C2] bg-[#1B2420] text-[#FBF9F4]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[#FF8904]">
              SEC.04
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-white/60">
              Your year in reading
            </span>
          </div>
          <h2 className="mb-10 font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
            Reading Statistics
          </h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl bg-white/5 p-5 sm:p-8">
              <p className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-white/50">
                Books finished per month
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReading} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#1B2420", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "#FBF9F4" }}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar dataKey="books" fill="#FF8904" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 sm:p-8">
              <p className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-white/50">
                Genre split (all-time)
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreSplit}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {genreSplit.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#1B2420" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#1B2420", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12 }}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Books this year", value: "95" },
              { label: "Pages read", value: "28,410" },
              { label: "Longest streak", value: "47 days" },
              { label: "Avg. rating given", value: "4.3★" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/5 p-4">
                <p className="font-[family-name:var(--font-display)] text-2xl font-medium">{s.value}</p>
                <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-white/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SEC 5 — WHY CHOOSE BOOKNEST ================= */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <CallNumber code="SEC.05" label="The case for us" />
        <h2 className="mb-10 font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
          Why Choose BookNest
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#DCD4C2] bg-[#FBF9F4] p-6 transition hover:border-[#2F6D4F]">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E7EEE6] text-[#2F6D4F]">
                <f.icon size={19} />
              </div>
              <p className="font-[family-name:var(--font-display)] text-lg font-medium">{f.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5850]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SEC 6 — TESTIMONIALS ================= */}
      <section className="border-y border-[#DCD4C2] bg-[#E7EEE6]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <CallNumber code="SEC.06" label="From the readers' desk" />
          <h2 className="mb-10 font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
            Testimonials
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-[#DCD4C2] bg-[#FBF9F4] p-6">
                <Quote size={20} className="mb-3 text-[#FF8904]" />
                <p className="text-[0.95rem] leading-relaxed text-[#1B2420]">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F6D4F] font-[family-name:var(--font-mono)] text-xs font-medium text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-[#4B5850]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SEC 7 — FAQ ================= */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <CallNumber code="SEC.07" label="Before you ask" />
        <h2 className="mb-10 font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-[#DCD4C2] rounded-2xl border border-[#DCD4C2] bg-white/60">
          {faqs.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
                  aria-expanded={open}
                >
                  <span className="font-[family-name:var(--font-display)] text-base font-medium sm:text-lg">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#2F6D4F] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-[#4B5850] sm:px-7">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section className="border-t border-[#DCD4C2] bg-[#1B2420]">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="max-w-md font-[family-name:var(--font-display)] text-2xl font-medium italic text-white sm:text-3xl">
            Your next favorite book is already on the shelf.
          </h3>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF8904] px-6 py-3 font-semibold text-white transition hover:bg-[#e57a00]"
          >
            Explore Books <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}