import React from "react";
import { Book } from "../types/book";
import { useRouter } from "next/navigation";

interface Props {
  book: Book;
}

const BookCard: React.FC<Props> = ({ book }) => {
  const router = useRouter();

  const openDetail = () => {
    router.push(`/explore/${book._id}`);
  };

  return (
    <div
      onClick={openDetail}
      className="group cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e8e3d8",
        boxShadow: "0 1px 2px rgba(28,27,25,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 16px 32px rgba(28,27,25,0.12)";
        e.currentTarget.style.borderColor = "#2f4538";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(28,27,25,0.04)";
        e.currentTarget.style.borderColor = "#e8e3d8";
      }}
    >
      {/* Cover */}
      <div
        className="h-48 relative overflow-hidden"
        style={{ backgroundColor: "#f2efe6" }}
      >
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center font-ui text-sm"
            style={{ color: "#b3ab98" }}
          >
            No Cover
          </div>
        )}
        {/* soft gradient so a top accent line reads cleanly on any image */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ backgroundColor: "#b08968" }}
        />
      </div>

      {/* Body */}
      <div className="p-4">
        <h3
          className="font-display text-lg truncate transition-colors duration-200"
          style={{ color: "#1c1b19", fontWeight: 600 }}
        >
          {book.title}
        </h3>
        <p className="font-ui text-sm mt-1" style={{ color: "#8a8578" }}>
          {book.author}
        </p>
        <p
          className="font-ui text-sm mt-2 line-clamp-2"
          style={{ color: "#a3998a" }}
        >
          {book.shortDescription}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span
            className="font-ui text-xs px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#eef0ea", color: "#2f4538" }}
          >
            {book.category || "Unknown"}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openDetail();
            }}
            className="font-ui text-sm px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all duration-200"
            style={{ backgroundColor: "#2f4538", color: "#fbf9f4" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#243a2d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2f4538")
            }
          >
            See details
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="transition-transform duration-200 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;