import React from "react";
import { Book } from "../types/book";

interface Props {
  book?: Book | null;
  onClose: () => void;
}

const BookModal: React.FC<Props> = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-[90%] max-w-3xl rounded-lg shadow-lg overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">Close</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex items-start">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-auto rounded" />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No Cover</div>
            )}
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-600"><strong>Author:</strong> {book.author}</p>
            <p className="text-sm text-gray-600"><strong>Category:</strong> {book.category || "—"}</p>
            <p className="text-sm text-gray-600"><strong>Language:</strong> {book.language || "—"}</p>
            <p className="text-sm text-gray-600"><strong>Published Year:</strong> {book.publishedYear || "—"}</p>
            <hr className="my-3" />
            <h3 className="font-medium mb-2">Short Description</h3>
            <p className="text-sm text-gray-700">{book.shortDescription}</p>

            <h3 className="font-medium mt-4 mb-2">Full Description</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{book.fullDescription}</p>

            <div className="mt-4 text-xs text-gray-500">
              <div>Created By: {book.createdBy}</div>
              <div>Created At: {book.createdAt}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;