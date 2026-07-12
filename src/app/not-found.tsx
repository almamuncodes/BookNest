"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: "#0f1712" }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-20 animate-pulse-slow"
          style={{ backgroundColor: "#f97316" }}
        />
      </div>

      <div className="relative text-center max-w-lg">
        {/* Big animated 404 with a floating book */}
        <div className="relative flex items-center justify-center mb-4">
          <h1
            className="text-[7rem] sm:text-[9rem] font-extrabold leading-none tracking-tight"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px #f97316",
            }}
          >
            404
          </h1>
          <span className="absolute text-6xl sm:text-7xl animate-float">
            📖
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          This page wandered off the shelf.
        </h2>
        <p className="text-neutral-400 leading-relaxed mb-10">
          We couldn&apos;t find the page you were looking for. Maybe it was
          moved, renamed, or never existed — but there are plenty of good
          books waiting for you back home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: "#f97316" }}
          >
            Back to Home
          </Link>
          <Link
            href="/explore"
            className="rounded-full border px-7 py-3 text-sm font-semibold text-neutral-300 transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:border-white"
            style={{ borderColor: "#1e2b23" }}
          >
            Explore Books
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(-4deg);
          }
          50% {
            transform: translateY(-14px) rotate(4deg);
          }
        }
        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.15;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}