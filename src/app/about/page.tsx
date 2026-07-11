"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ------------------- SCROLL REVEAL HOOK -------------------
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

// ------------------- ANIMATED COUNTER -------------------
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

// ------------------- REVEAL WRAPPER -------------------
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ------------------- DATA -------------------
const FEATURES = [
  {
    icon: "📚",
    title: "Vast Library",
    desc: "Thousands of books uploaded by a passionate community, spanning every genre imaginable.",
  },
  {
    icon: "🔖",
    title: "Smart Bookmarks",
    desc: "Save any book with one tap and pick up exactly where you left off, anytime.",
  },
  {
    icon: "🌙",
    title: "Read Anywhere",
    desc: "A clean, distraction-free reader that works beautifully on any device.",
  },
  {
    icon: "🤝",
    title: "Community Driven",
    desc: "Real readers sharing real books — no paywalls, no gatekeeping, just stories.",
  },
];

const STATS = [
  { label: "Books Shared", value: 4200, suffix: "+" },
  { label: "Active Readers", value: 12500, suffix: "+" },
  { label: "Bookmarks Saved", value: 38900, suffix: "+" },
  { label: "Genres", value: 24, suffix: "" },
];

// ------------------- PAGE -------------------
export default function AboutPage() {
  return (
  

   
    <main className="relative overflow-hidden bg-[#fbf9f4]">
      {/* ---------- Animated background blobs ---------- */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* ---------- Hero ---------- */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
        <Reveal>
          <span className="inline-block rounded-full bg-neutral-900 text-white text-xs font-medium px-4 py-1 mb-6 tracking-wide">
            OUR STORY
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
            Books belong to
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              everyone.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 max-w-2xl text-lg text-neutral-500 leading-relaxed">
            BookNest is a home for readers and storytellers — a place where
            anyone can share a book and anyone can discover their next
            favorite one, completely free.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex gap-4">
            <Link
              href="/explore"
              className="rounded-full bg-neutral-900 text-white px-7 py-3 text-sm font-semibold hover:bg-neutral-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Our Story
            </Link>
            <Link
              href="/explore"
              className="rounded-full border border-neutral-300 px-7 py-3 text-sm font-semibold text-neutral-700 hover:border-neutral-900 hover:-translate-y-0.5 transition-all duration-300"
            >
              Browse Books
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ---------- Story ---------- */}
      <section id="story" className="relative px-6 py-24 bg-neutral-50">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl flex items-center justify-center text-8xl transition-transform duration-500 hover:scale-105 hover:rotate-1">
              📖
            </div>
          </Reveal>

          <Reveal delay={150}>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-5">
              Why we built BookNest
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We noticed something simple: great books were sitting unread on
              shelves while curious readers had nowhere free to turn. So we
              built a nest — a shared space where a book someone finishes can
              instantly become the book someone else discovers.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              No prices, no barriers. Just people passing stories forward,
              one bookmark at a time.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="relative px-6 py-24">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            What makes it special
          </h2>
          <p className="text-neutral-500 mt-3">
            Everything you need to fall back in love with reading.
          </p>
        </Reveal>

        <div className="mx-auto max-w-5xl grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 120}>
              <div className="group h-full rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-transparent">
                <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="relative px-6 py-24 bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_top_left,_#6366f1,_transparent_60%)]" />
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">Growing together</h2>
          <p className="text-neutral-400 mt-3">
            Numbers that keep us inspired every day.
          </p>
        </Reveal>

        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="transition-transform duration-300 hover:scale-110"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <p className="text-neutral-400 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative px-6 py-28 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-5">
            Ready to start reading?
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto mb-10">
            Join thousands of readers exploring free books shared by a
            community that just loves stories.
          </p>
          <Link 
            href="/explore"
            className="inline-block rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-4 text-sm font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Explore the Library
          </Link>
        </Reveal>
      </section>

      {/* ---------- Keyframes for the floating blobs ---------- */}
      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
   
  );
}