"use client";

import { useSession } from "@/lib/auth-client";
/**
 * app/my-posts/page.tsx
 * ----------------------------------------------------------------
 * BookNest — "My Posts" page
 *
 * Shows all books posted by the logged-in user, with edit and
 * delete actions.
 *
 * Assumptions (change if needed):
 *  1. Tailwind CSS is already configured in your project (most
 *     common setup for a Next.js + TS project).
 *  2. Users are identified by the "createdBy" field in MongoDB
 *     (stores the user's email). This page reads session.user.email
 *     via NextAuth's `useSession()` hook and filters by that.
 *     The app router root needs to be wrapped in <SessionProvider>
 *     (usually already set up in app/layout.tsx or providers.tsx).
 *  3. Backend URL is set as NEXT_PUBLIC_API_URL in .env.local.
 *     e.g. NEXT_PUBLIC_API_URL=http://localhost:5000
 *  4. Backend now requires "requesterEmail" in the body of
 *     PATCH/DELETE requests to /api/items/:id, so the server can
 *     verify the requester actually owns the book (createdBy match).
 * ----------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from "react";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ----------------------------------------------------------------
// Types (matches your actual MongoDB document shape)
// ----------------------------------------------------------------
interface Book {
  _id: string;
  title: string;
  author?: string;
  category?: string;
  language?: string;
  publishedYear?: number;
  coverImage?: string;
  shortDescription?: string;
  fullDescription?: string;
  createdBy: string; // user's email — this is what posts are filtered by
  createdAt?: string;
  [key: string]: unknown;
}

type ModalState =
  | { type: "none" }
  | { type: "edit"; book: Book }
  | { type: "delete"; book: Book };

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------
export default function MyPostsPage() {
  const { data: session, isPending } = useSession();
  const userEmail = session?.user?.email ?? null;
  const sessionLoading = isPending;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [toast, setToast] = useState<string | null>(null);

  const fetchMyBooks = useCallback(async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/api/items/user/${encodeURIComponent(userEmail)}`
      );
      if (!res.ok) throw new Error("Failed to load your posts");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (sessionLoading) return;
    fetchMyBooks();
  }, [sessionLoading, fetchMyBooks]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleDelete = async (book: Book) => {
    if (!userEmail) {
      setToast("You must be signed in to delete a book");
      setModal({ type: "none" });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/items/${book._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterEmail: userEmail }),
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("You don't have permission to delete this book");
        }
        throw new Error("Delete failed");
      }
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
      setToast("Book deleted");
    } catch (err) {
      setToast(
        err instanceof Error ? err.message : "Failed to delete, please try again"
      );
    } finally {
      setModal({ type: "none" });
    }
  };

  const handleEditSave = async (updated: Partial<Book>) => {
    if (modal.type !== "edit") return;
    if (!userEmail) {
      setToast("You must be signed in to edit a book");
      setModal({ type: "none" });
      return;
    }
    const bookId = modal.book._id;
    try {
      const res = await fetch(`${API_URL}/api/items/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updated, requesterEmail: userEmail }),
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("You don't have permission to edit this book");
        }
        throw new Error("Update failed");
      }
      setBooks((prev) =>
        prev.map((b) => (b._id === bookId ? { ...b, ...updated } : b))
      );
      setToast("Changes saved");
    } catch (err) {
      setToast(
        err instanceof Error
          ? err.message
          : "Failed to save changes, please try again"
      );
    } finally {
      setModal({ type: "none" });
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF6EF] text-[#241C15]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Header */}
        <header className="mb-10 flex items-end justify-between border-b border-[#E4DBC8] pb-6">
          <div>
            <p className="mb-1 font-serif text-sm uppercase tracking-[0.2em] text-[#9C6B3E]">
              BookNest
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight">
              My Posts
            </h1>
          </div>
          <span className="hidden font-serif text-sm text-[#8A7D68] sm:inline">
            {books.length} books
          </span>
        </header>

        {/* States */}
        {sessionLoading && <LoadingGrid />}

        {!sessionLoading && !userEmail && (
          <EmptyState
            title="You're not signed in"
            message="Sign in to see the books you've posted."
          />
        )}

        {!sessionLoading && userEmail && loading && <LoadingGrid />}

        {!sessionLoading && userEmail && !loading && error && (
          <EmptyState title="Something went wrong" message={error} />
        )}

        {!sessionLoading &&
          userEmail &&
          !loading &&
          !error &&
          books.length === 0 && (
            <EmptyState
              title="No posts yet"
              message="Books you post will show up here."
            />
          )}

        {!sessionLoading &&
          userEmail &&
          !loading &&
          !error &&
          books.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onEdit={() => setModal({ type: "edit", book })}
                  onDelete={() => setModal({ type: "delete", book })}
                />
              ))}
            </div>
          )}
      </div>

      {/* Edit modal */}
      {modal.type === "edit" && (
        <EditModal
          book={modal.book}
          onCancel={() => setModal({ type: "none" })}
          onSave={handleEditSave}
        />
      )}

      {/* Delete confirm modal */}
      {modal.type === "delete" && (
        <ConfirmDeleteModal
          book={modal.book}
          onCancel={() => setModal({ type: "none" })}
          onConfirm={() => handleDelete(modal.book)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[#241C15] px-5 py-2.5 font-serif text-sm text-[#FAF6EF] shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}

// ----------------------------------------------------------------
// Book card
// ----------------------------------------------------------------
function BookCard({
  book,
  onEdit,
  onDelete,
}: {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-[#E4DBC8] bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-44 w-full overflow-hidden bg-[#EFE7D6]">
        {book.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-3xl text-[#C8B896]">
            {book.title?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-lg font-semibold leading-snug">
          {book.title}
        </h3>
        {book.author && (
          <p className="text-sm text-[#8A7D68]">by {book.author}</p>
        )}
        {book.shortDescription && (
          <p className="mt-1 line-clamp-2 text-sm text-[#5C5346]">
            {book.shortDescription}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {book.category && (
            <span className="inline-block w-fit rounded-full bg-[#F1E8D6] px-2.5 py-0.5 text-xs text-[#9C6B3E]">
              {book.category}
            </span>
          )}
          {book.language && (
            <span className="inline-block w-fit rounded-full bg-[#EFE7D6] px-2.5 py-0.5 text-xs text-[#8A7D68]">
              {book.language}
            </span>
          )}
          {book.publishedYear && (
            <span className="inline-block w-fit rounded-full bg-[#EFE7D6] px-2.5 py-0.5 text-xs text-[#8A7D68]">
              {book.publishedYear}
            </span>
          )}
        </div>
      </div>

      <div className="flex border-t border-[#E4DBC8]">
        <button
          onClick={onEdit}
          className="flex-1 py-2.5 text-sm font-medium text-[#241C15] transition-colors hover:bg-[#F1E8D6]"
        >
          Edit
        </button>
        <div className="w-px bg-[#E4DBC8]" />
        <button
          onClick={onDelete}
          className="flex-1 py-2.5 text-sm font-medium text-[#B3432B] transition-colors hover:bg-[#FBEDE9]"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Edit modal
// ----------------------------------------------------------------
function EditModal({
  book,
  onCancel,
  onSave,
}: {
  book: Book;
  onCancel: () => void;
  onSave: (updated: Partial<Book>) => void;
}) {
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [category, setCategory] = useState(book.category || "");
  const [language, setLanguage] = useState(book.language || "");
  const [publishedYear, setPublishedYear] = useState(
    book.publishedYear ? String(book.publishedYear) : ""
  );
  const [coverImage, setCoverImage] = useState(book.coverImage || "");
  const [shortDescription, setShortDescription] = useState(
    book.shortDescription || ""
  );
  const [fullDescription, setFullDescription] = useState(
    book.fullDescription || ""
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      title,
      author,
      category,
      language,
      publishedYear: publishedYear ? Number(publishedYear) : undefined,
      coverImage,
      shortDescription,
      fullDescription,
    });
    setSaving(false);
  };

  return (
    <ModalShell onCancel={onCancel}>
      <h2 className="mb-5 font-serif text-2xl font-semibold">Edit Book</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
        </Field>
        <Field label="Author">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Language">
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input"
            />
          </Field>
        </div>
        <Field label="Published Year">
          <input
            type="number"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Cover Image URL">
          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Short Description">
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={2}
            className="input resize-none"
          />
        </Field>
        <Field label="Full Description">
          <textarea
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            rows={4}
            className="input resize-none"
          />
        </Field>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[#E4DBC8] px-4 py-2 text-sm font-medium text-[#241C15] hover:bg-[#F1E8D6]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[#241C15] px-4 py-2 text-sm font-medium text-[#FAF6EF] hover:bg-[#3A2E22] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e4dbc8;
          padding: 0.55rem 0.75rem;
          font-size: 0.9rem;
          background: #fdfbf6;
          outline: none;
        }
        .input:focus {
          border-color: #9c6b3e;
          box-shadow: 0 0 0 3px rgba(156, 107, 62, 0.15);
        }
      `}</style>
    </ModalShell>
  );
}

// ----------------------------------------------------------------
// Delete confirm modal
// ----------------------------------------------------------------
function ConfirmDeleteModal({
  book,
  onCancel,
  onConfirm,
}: {
  book: Book;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <ModalShell onCancel={onCancel}>
      <h2 className="mb-2 font-serif text-2xl font-semibold">
        Delete this book?
      </h2>
      <p className="mb-6 text-sm text-[#8A7D68]">
        &ldquo;{book.title}&rdquo; will be permanently removed. This cannot
        be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-md border border-[#E4DBC8] px-4 py-2 text-sm font-medium hover:bg-[#F1E8D6]"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            setDeleting(true);
            await onConfirm();
          }}
          disabled={deleting}
          className="rounded-md bg-[#B3432B] px-4 py-2 text-sm font-medium text-white hover:bg-[#9A3823] disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Yes, Delete"}
        </button>
      </div>
    </ModalShell>
  );
}

// ----------------------------------------------------------------
// Shared bits
// ----------------------------------------------------------------
function ModalShell({
  children,
  onCancel,
}: {
  children: React.ReactNode;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl bg-[#FAF6EF] p-6 shadow-xl"
      >
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-[#8A7D68]">
        {label}
      </span>
      {children}
    </label>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#E4DBC8] bg-white/50 py-20 text-center">
      <h2 className="mb-1 font-serif text-xl font-semibold">{title}</h2>
      <p className="max-w-sm text-sm text-[#8A7D68]">{message}</p>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-lg border border-[#E4DBC8] bg-[#F1E8D6]"
        />
      ))}
    </div>
  );
}