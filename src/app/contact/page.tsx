"use client";

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

// ------------------- COPY TO CLIPBOARD CARD -------------------
function CopyCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API blocked — fail silently
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="group relative block w-full h-full rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur p-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-transparent"
    >
      <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      <p className="text-neutral-500 text-sm mt-1">{value}</p>

      <span
        className={`pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 text-white text-xs px-3 py-1 transition-all duration-300 ${
          copied ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-0"
        }`}
      >
        Copied!
      </span>

      <span className="mt-2 inline-block text-[11px] text-neutral-400 group-hover:text-neutral-600 transition-colors">
        Tap to copy
      </span>
    </button>
  );
}

// ------------------- DATA -------------------
const CONTACT_INFO = [
  { icon: "📧", title: "Email", value: "almamun2026islam@gmail.com" },
  { icon: "📞", title: "Phone", value: "+880 1994810194" },
  { icon: "📍", title: "Location", value: "Mymensingh, Bangladesh" },
  { icon: "🕒", title: "Hours", value: "Sat–Thu, 10am–6pm" },
];

const FAQS = [
  {
    q: "How do I upload a book?",
    a: "Log in, go to your dashboard, and use the \"Add Book\" option. Fill in the title, author, and content — it's live instantly.",
  },
  {
    q: "Is BookNest really free?",
    a: "Yes. Every book on BookNest is shared by readers for readers, with no fees or subscriptions.",
  },
  {
    q: "How do bookmarks work?",
    a: "Tap the bookmark icon on any book to save it to your personal list, and remove it anytime from the same button.",
  },
];

// ------------------- PAGE -------------------
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      // TODO: point this at your real backend endpoint, e.g.
      // POST `${process.env.NEXT_PUBLIC_SERVER_URL}/api/contact`
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <main
      className="relative overflow-hidden min-h-screen"
      style={{ backgroundColor: "#fbf9f4" }}
    >
      {/* ---------- Background blobs ---------- */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* ---------- Hero ---------- */}
      <section className="px-6 pt-28 pb-16 text-center">
        <Reveal>
          <span className="inline-block rounded-full bg-neutral-900 text-white text-xs font-medium px-4 py-1 mb-6 tracking-wide">
            GET IN TOUCH
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
            Let&apos;s talk
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              books &amp; ideas.
            </span>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 max-w-xl mx-auto text-neutral-500 leading-relaxed">
            Questions, feedback, or just want to say hi? Drop us a message —
            we read every single one. Or tap any detail below to copy it
            instantly.
          </p>
        </Reveal>
      </section>

      {/* ---------- Contact info cards (copy on click) ---------- */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {CONTACT_INFO.map((info, i) => (
            <Reveal key={info.title} delay={i * 100}>
              <CopyCard {...info} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Contact form ---------- */}
      <section className="px-6 pb-24">
        <Reveal className="mx-auto max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-neutral-200 bg-white shadow-xl p-8 sm:p-10 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none resize-none transition-all duration-300 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3.5 text-sm font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "sent" && (
              <p className="text-center text-sm text-green-600 animate-pulse">
                Thanks! Your message has been sent. 🎉
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-sm text-red-500">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </Reveal>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="px-6 pb-28">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            Frequently asked
          </h2>
          <p className="text-neutral-500 mt-3">
            A few quick answers before you reach out.
          </p>
        </Reveal>

        <div className="mx-auto max-w-2xl space-y-4">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 100}>
              <div className="rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur p-6 transition-all duration-300 hover:shadow-lg hover:border-transparent">
                <h3 className="font-semibold text-neutral-900 mb-2">{f.q}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {f.a}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Keyframes ---------- */}
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