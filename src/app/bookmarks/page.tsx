"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

// ------------------- TYPES -------------------
interface Bookmark {
  _id: string;
  userId: string;
  bookId: string;
  createdAt: string;
}

// Adjust these fields to match what your itemCollection documents actually contain
interface Book {
  _id: string;
  title: string;
  author: string;
coverImage?: string;
}

interface BookmarkedBook extends Book {
  bookmarkedAt: string;
}

// ------------------- API HELPERS -------------------
async function fetchBookmarks(userId: string): Promise<Bookmark[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookmarks/${userId}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to load bookmarks");
  return res.json();
}

// Backend route is /api/items/:id, not /api/books/:id
async function fetchBook(bookId: string): Promise<Book> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/items/${bookId}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Failed to load book ${bookId}`);
  return res.json();
}

async function fetchBookmarkedBooks(userId: string): Promise<BookmarkedBook[]> {
  const bookmarks = await fetchBookmarks(userId);

  const results = await Promise.allSettled(
    bookmarks.map(async (bm) => {
      const book = await fetchBook(bm.bookId);
      return { ...book, bookmarkedAt: bm.createdAt } as BookmarkedBook;
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<BookmarkedBook> => r.status === "fulfilled"
    )
    .map((r) => r.value)
    .sort(
      (a, b) => new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
    );
}

async function toggleBookmark(
  userId: string,
  bookId: string
): Promise<{ bookmarked: boolean }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookmarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, bookId }),
  });
  if (!res.ok) throw new Error("Failed to toggle bookmark");
  return res.json();
}

// ------------------- PAGE -------------------
export default function BookmarksPage() {
  const [books, setBooks] = useState<BookmarkedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const session = useSession();
  const CURRENT_USER_ID = session?.data?.user?.id;

  useEffect(() => {
    // wait until the session has actually resolved a user id
    if (!CURRENT_USER_ID) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchBookmarkedBooks(CURRENT_USER_ID as string);
        if (!cancelled) setBooks(data);
      } catch {
        if (!cancelled) setError("Failed to load bookmarks. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [CURRENT_USER_ID]);

  async function handleRemove(bookId: string) {
    if (!CURRENT_USER_ID) return;

    setRemovingId(bookId);
    const prev = books;
    setBooks((b) => b.filter((book) => book._id !== bookId));

    try {
      await toggleBookmark(CURRENT_USER_ID, bookId);
    } catch {
      setBooks(prev); // rollback on failure
      alert("Failed to remove bookmark. Please try again.");
    } finally {
      setRemovingId(null);
    }
  }

  // still waiting on auth session
  if (!CURRENT_USER_ID) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-neutral-500 text-center py-20">
          Please log in to see your bookmarks.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#241C15]">

  
    <main className="mx-auto max-w-6xl px-4 py-10 ">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">My Bookmarks</h1>
      <p className="text-neutral-500 mb-8">All your saved books will show up here.</p>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && <p className="text-red-500 text-center py-20">{error}</p>}

      {!loading && !error && books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-neutral-500 text-lg">No bookmarks yet.</p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {books.map((book) => (
            <div
              key={book._id}
              className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Remove button */}
              <button
                onClick={() => handleRemove(book._id)}
                disabled={removingId === book._id}
                aria-label="Remove bookmark"
                className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-500 shadow hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
              >
                {removingId === book._id ? (
                  <span className="h-3 w-3 animate-spin  rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>

              {/* Details link */}
        <Link href={`/explore/${book._id}`} className="flex flex-col flex-1">
  <div className="relative h-56 w-full bg-neutral-100 overflow-hidden">
    {book.coverImage ? (
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-neutral-400 text-sm">
        No cover
      </div>
    )}
  </div>

  <div className="p-4 flex-1 flex flex-col gap-1">
    <h3 className="font-semibold text-neutral-900 line-clamp-2">
      {book.title}
    </h3>
    <p className="text-sm text-neutral-500">{book.author}</p>
  </div>
</Link>
            </div>
          ))}
        </div>
      )}
    </main>
      </div>
  );
}