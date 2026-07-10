"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

// imgbb upload endpoint — set NEXT_PUBLIC_IMGBB_KEY in your .env.local
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

// ---- Types ----
interface BookFormData {
  title: string;
  author: string;
  category: string;
  language: string;
  publishedYear: string;
  coverImage: string;
  shortDescription: string;
  fullDescription: string;
}

const CATEGORIES = [
  "Programming",
  "Fiction",
  "Non-fiction",
  "Science",
  "History",
  "Poetry",
  "Biography",
  "Other",
];

const LANGUAGES = ["English", "Bangla", "Hindi", "Other"];

const EMPTY_FORM: BookFormData = {
  title: "",
  author: "",
  category: "",
  language: "",
  publishedYear: "",
  coverImage: "",
  shortDescription: "",
  fullDescription: "",
};

export default function AddBookPage() {
  const router = useRouter();

  // ---- Auth guard (next-auth) ----
  const { data: session, status: authStatus } = useSession();
  const userEmail = session?.user?.email ?? null;

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/signin");
    }
  }, [authStatus, router]);

  const checkingAuth = authStatus === "loading" || authStatus === "unauthenticated";

  // ---- Form state ----
  const [form, setForm] = useState<BookFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---- imgbb image upload ----
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!IMGBB_KEY) {
      setErrorMsg("imgbb key is not set — add NEXT_PUBLIC_IMGBB_KEY in .env.local.");
      setStatus("error");
      return;
    }

    setUploadingImage(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        { method: "POST", body }
      );
      const data = await res.json();
      if (!data?.data?.url) throw new Error("upload failed");
      setForm((prev) => ({ ...prev, coverImage: data.data.url }));
    } catch {
      setStatus("error");
      setErrorMsg("Could not upload the image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;
    setSubmitting(true);
    setStatus("idle");
    setErrorMsg("");

    const payload = {
      ...form,
      publishedYear: Number(form.publishedYear) || undefined,
      createdBy: userEmail,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus("error");
      setErrorMsg("Could not post the book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="ab-loading-screen">
        <style>{globalStyles}</style>
        <div className="ab-spinner" />
      </div>
    );
  }

  return (
    <div className="ab-page">
      <style>{globalStyles}</style>
      <div className="ab-wrap">
        {/* Left: form */}
        <div className="ab-form-panel">
          <p className="ab-eyebrow">New entry</p>
          <h1 className="ab-h1">Add your book</h1>
          <p className="ab-sub">
            There&apos;s room on the shelf. Fill in the book&apos;s details and
            we&apos;ll take care of the rest.
          </p>

          <form onSubmit={handleSubmit} className="ab-form">
            <div className="ab-row2">
              <Field label="Title">
                <input
                  required
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Clean Code"
                  className="ab-input"
                />
              </Field>
              <Field label="Author">
                <input
                  required
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Robert C. Martin"
                  className="ab-input"
                />
              </Field>
            </div>

            <div className="ab-row3">
              <Field label="Category">
                <select
                  required
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="ab-input"
                >
                  <option value="">Choose one</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Language">
                <select
                  required
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="ab-input"
                >
                  <option value="">Choose one</option>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Published Year">
                <input
                  required
                  type="number"
                  name="publishedYear"
                  value={form.publishedYear}
                  onChange={handleChange}
                  placeholder="2008"
                  className="ab-input"
                />
              </Field>
            </div>

            <Field label="Cover Image">
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleImageUpload}
                className="ab-input"
              />
              {uploadingImage && (
                <span className="ab-upload-hint">Uploading...</span>
              )}
              {!uploadingImage && form.coverImage && (
                <span className="ab-upload-hint">Image uploaded ✓</span>
              )}
            </Field>

            <Field label="Short Description">
              <input
                required
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="Sum up the book in one line"
                className="ab-input"
              />
            </Field>

            <Field label="Full Description">
              <textarea
                required
                name="fullDescription"
                value={form.fullDescription}
                onChange={handleChange}
                placeholder="Write the details here..."
                rows={5}
                className="ab-input ab-textarea"
              />
            </Field>

            <div className="ab-meta-row">
              <span>Posted as</span>
              <strong>{userEmail}</strong>
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="ab-submit-btn"
            >
              {submitting ? "Posting..." : "Add to shelf"}
            </button>

            {status === "success" && (
              <p className="ab-success-msg">The book is on the shelf ✓</p>
            )}
            {status === "error" && <p className="ab-error-msg">{errorMsg}</p>}
          </form>
        </div>

        {/* Right: live book cover preview */}
        <div className="ab-preview-panel">
          <p className="ab-preview-label">Preview</p>
          <div className="ab-book">
            <div className="ab-book-spine" />
            <div className="ab-book-cover">
              {form.coverImage ? (
                <img
                  src={form.coverImage}
                  alt="cover"
                  className="ab-cover-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="ab-cover-placeholder">
                  <span className="ab-cover-placeholder-text">
                    {form.title ? form.title.slice(0, 1).toUpperCase() : "?"}
                  </span>
                </div>
              )}
              <div className="ab-cover-text-block">
                <p className="ab-cover-title">{form.title || "Book title"}</p>
                <p className="ab-cover-author">{form.author || "Author name"}</p>
              </div>
            </div>
          </div>
          <div className="ab-preview-meta">
            <MetaRow label="Category" value={form.category || "—"} />
            <MetaRow label="Language" value={form.language || "—"} />
            <MetaRow label="Year" value={form.publishedYear || "—"} />
          </div>
          {form.shortDescription && (
            <p className="ab-preview-desc">{form.shortDescription}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="ab-field">
      <span className="ab-label">{label}</span>
      {children}
    </label>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ab-meta-row-small">
      <span className="ab-meta-label">{label}</span>
      <span className="ab-meta-value">{value}</span>
    </div>
  );
}

// ---- Design tokens ----
// Palette: ink green (#1F3B2E) + brass gold (#C9A227) on warm paper (#F7F4EE)
// — a bookshelf/library feel rather than the usual cream+terracotta combo.
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');

  @keyframes ab-spin {
    to { transform: rotate(360deg); }
  }

  .ab-page {
    min-height: 100vh;
    background: #F7F4EE;
    font-family: 'Inter', sans-serif;
    color: #22201B;
    padding: 48px 24px;
  }

  .ab-loading-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F7F4EE;
  }

  .ab-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #E3DDCC;
    border-top-color: #1F3B2E;
    border-radius: 50%;
    animation: ab-spin 0.8s linear infinite;
  }

  .ab-wrap {
    max-width: 1080px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
    align-items: start;
  }

  .ab-form-panel {
    background: #FFFFFF;
    border: 1px solid #E3DDCC;
    border-radius: 4px;
    padding: 40px 44px;
  }

  .ab-eyebrow {
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #C9A227;
    font-weight: 600;
    margin: 0;
  }

  .ab-h1 {
    font-family: 'Fraunces', serif;
    font-size: 34px;
    font-weight: 600;
    margin: 8px 0 6px;
    color: #1F3B2E;
  }

  .ab-sub {
    font-size: 14.5px;
    color: #5B5648;
    margin: 0 0 28px;
    line-height: 1.5;
  }

  .ab-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .ab-row2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .ab-row3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }

  .ab-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ab-label {
    font-size: 12.5px;
    font-weight: 600;
    color: #5B5648;
  }

  .ab-input {
    border: 1px solid #DDD6C4;
    border-radius: 3px;
    padding: 10px 12px;
    font-size: 14.5px;
    background: #FBFAF6;
    color: #22201B;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
  }

  .ab-textarea {
    resize: vertical;
  }

  .ab-upload-hint {
    font-size: 12px;
    color: #1F3B2E;
    display: block;
    margin-top: 4px;
  }

  .ab-meta-row {
    font-size: 13px;
    color: #5B5648;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .ab-submit-btn {
    margin-top: 8px;
    background: #1F3B2E;
    color: #F7F4EE;
    border: none;
    border-radius: 3px;
    padding: 13px 20px;
    font-size: 14.5px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
  }

  .ab-success-msg {
    color: #1F3B2E;
    font-size: 13.5px;
    margin: 0;
  }

  .ab-error-msg {
    color: #B5482E;
    font-size: 13.5px;
    margin: 0;
  }

  .ab-preview-panel {
    position: sticky;
    top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .ab-preview-label {
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #A79E85;
    font-weight: 600;
    align-self: flex-start;
    margin: 0;
  }

  .ab-book {
    display: flex;
    width: 240px;
    height: 340px;
    max-width: 100%;
    filter: drop-shadow(0 18px 30px rgba(31,59,46,0.18));
  }

  .ab-book-spine {
    width: 14px;
    background: #16281F;
    border-radius: 3px 0 0 3px;
  }

  .ab-book-cover {
    flex: 1;
    background: linear-gradient(160deg, #1F3B2E 0%, #274A38 100%);
    border-radius: 0 3px 3px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 18px;
    position: relative;
    overflow: hidden;
  }

  .ab-cover-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9;
  }

  .ab-cover-placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ab-cover-placeholder-text {
    font-family: 'Fraunces', serif;
    font-size: 64px;
    color: rgba(201,162,39,0.35);
    font-weight: 700;
  }

  .ab-cover-text-block {
    position: relative;
    z-index: 1;
    background: rgba(22,40,31,0.55);
    backdrop-filter: blur(2px);
    border-radius: 2px;
    padding: 8px 10px;
  }

  .ab-cover-title {
    font-family: 'Fraunces', serif;
    color: #F7F4EE;
    font-size: 17px;
    font-weight: 600;
    margin: 0;
    line-height: 1.25;
  }

  .ab-cover-author {
    color: #C9A227;
    font-size: 12.5px;
    margin: 4px 0 0;
  }

  .ab-preview-meta {
    width: 240px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ab-meta-row-small {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    border-bottom: 1px dashed #DDD6C4;
    padding-bottom: 4px;
  }

  .ab-meta-label { color: #A79E85; }
  .ab-meta-value { color: #22201B; font-weight: 500; }

  .ab-preview-desc {
    width: 240px;
    max-width: 100%;
    font-size: 13px;
    color: #5B5648;
    line-height: 1.5;
    font-style: italic;
    margin: 0;
  }

  /* ---- Responsive breakpoints ---- */

  @media (max-width: 900px) {
    .ab-wrap {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .ab-preview-panel {
      position: static;
      order: -1;
    }

    .ab-form-panel {
      padding: 32px 28px;
    }
  }

  @media (max-width: 640px) {
    .ab-page {
      padding: 28px 16px;
    }

    .ab-form-panel {
      padding: 24px 18px;
      border-radius: 3px;
    }

    .ab-h1 {
      font-size: 26px;
    }

    .ab-row2,
    .ab-row3 {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .ab-book,
    .ab-preview-meta,
    .ab-preview-desc {
      width: 100%;
      max-width: 280px;
    }

    .ab-submit-btn {
      padding: 14px 18px;
    }
  }
`;