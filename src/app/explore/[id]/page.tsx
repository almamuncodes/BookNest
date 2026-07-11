"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";
import { Book } from "@/types/book";

const BookDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  // ডাইনামিক ইউজারের আইডি এখানে আসবে (Auth সিস্টেম থেকে)
  const user = useSession();

  const userId = user.data?.user.id;

  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  
  if(!userId) {
    console.log(user)
    router.push("/signin");
  }

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        // ১. বইয়ের ডিটেইলস আনা
        const bookRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/items/${id}`);
        if (!bookRes.ok) throw new Error("Failed to fetch book");
        const bookData = await bookRes.json();
        setBook(bookData);

        // ২. ইউজারের বুকমার্ক লিস্ট চেক করা (userId থাকলেই)
        if (userId) {
          const bookmarkRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookmarks/${userId}`);
          const bookmarks = await bookmarkRes.json();

          const isExists = bookmarks.some((item: any) => item.bookId === id);
          setIsBookmarked(isExists);
        }
      } catch (err) {
        setError("Unable to fetch data. Check server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, userId]);

  // বুকমার্ক টগল করার ফাংশন
  const handleBookmarkToggle = async () => {
    setBookmarkLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookmarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId: id }),
      });

      if (res.ok) {
        const result = await res.json();
        setIsBookmarked(result.bookmarked);
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !book)
    return <div className="min-h-screen flex items-center justify-center">{error || "Book not found"}</div>;

  return (
    <div className="min-h-screen bg-[#f2f4f1] py-8">
      <main className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
          <button
            onClick={handleBookmarkToggle}
            disabled={bookmarkLoading}
            className={`px-6 py-2 rounded-full font-medium transition ${
              isBookmarked ? "bg-red-500 text-white" : "bg-indigo-600 text-white"
            } hover:opacity-90`}
          >
            {bookmarkLoading ? "Processing..." : isBookmarked ? "★ Remove Bookmark" : "☆ Add Bookmark"}
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-auto rounded shadow-md" />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                No Cover
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <p className="text-gray-700"><strong>Author:</strong> {book.author}</p>
            <p className="text-gray-700"><strong>Category:</strong> {book.category || "—"}</p>
            <p className="text-gray-700"><strong>Language:</strong> {book.language || "—"}</p>
            <p className="text-gray-700"><strong>Published Year:</strong> {book.publishedYear || "—"}</p>

            <h3 className="font-semibold text-lg pt-4">Short Description</h3>
            <p className="text-gray-600">{book.shortDescription}</p>
          </div>
        </div>

        {/* Full Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="font-semibold text-lg mb-4">Full Description</h3>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
            {book.fullDescription}
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button onClick={() => router.back()} className="text-indigo-600 hover:underline font-medium">
            ← Back
          </button>
        </div>
      </main>
    </div>
  );
};

export default BookDetailPage;