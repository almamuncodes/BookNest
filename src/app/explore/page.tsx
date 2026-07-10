'use client'
import React, { useEffect, useMemo, useState } from "react";

import BookCard from "@/Components/BookCard";
import { Book } from "@/types/book";

const CATEGORIES = [
  "All",
  "Programming",
  "Fiction",
  "Non-fiction",
  "Science",
  "History",
  "Poetry",
  "Biography",
  "Other",
];

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Book | null>(null);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/items");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(err);
        setError("Unable to load books. Check API or CORS.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesCategory =
        category === "All" ||
        (b as any).category?.toLowerCase() === category.toLowerCase();
      const matchesSearch = b.title
        ?.toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [books, search, category]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#fbf9f4" }}
    >
      {/* Google Fonts — Fraunces for display, Inter for UI */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
        }
        .font-ui {
          font-family: "Inter", sans-serif;
        }
      `}</style>

      <header
        className="border-b"
        style={{ borderColor: "#e8e3d8", backgroundColor: "#fbf9f4" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-end justify-between">
          <div>
            <p
              className="font-ui text-xs tracking-[0.2em] uppercase mb-1"
              style={{ color: "#b08968" }}
            >
              Personal Library
            </p>
            <h1
              className="font-display text-4xl"
              style={{ color: "#1c1b19", fontWeight: 600 }}
            >
              Books Dashboard
            </h1>
          </div>
          <div
            className="font-ui text-sm px-3 py-1.5 rounded-full"
            style={{ color: "#2f4538", backgroundColor: "#eef0ea" }}
          >
            {filteredBooks.length} of {books.length} books
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8a8578"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="font-ui w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-shadow focus:shadow-md"
              style={{
                borderColor: "#e8e3d8",
                backgroundColor: "#ffffff",
                color: "#1c1b19",
              }}
            />
          </div>
        </div>

        {/* Category filter — library catalog tabs */}
        <div
          className="mb-10 flex flex-wrap gap-1 border-b"
          style={{ borderColor: "#2f4538" }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="font-ui text-sm px-4 py-2 rounded-t-md transition-all relative"
                style={{
                  color: isActive ? "#1c1b19" : "#8a8578",
                  backgroundColor: isActive ? "#ffffff" : "transparent",
                  fontWeight: isActive ? 600 : 400,
                  border: isActive ? "1px solid #e8e3d8" : "1px solid transparent",
                  borderBottom: isActive ? "1px solid #ffffff" : "none",
                  marginBottom: "-1px",
                }}
              >
                {cat}
                {isActive && (
                  <span
                    className="absolute left-0 right-0 -bottom-[1px] h-[2px]"
                    style={{ backgroundColor: "#b08968" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="font-ui text-center py-20" style={{ color: "#8a8578" }}>
            Loading...
          </div>
        ) : error ? (
          <div className="font-ui text-center py-10" style={{ color: "#b3543f" }}>
            {error}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="font-ui text-center py-16" style={{ color: "#8a8578" }}>
            {search || category !== "All"
              ? "No books match your search."
              : "No books found."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;