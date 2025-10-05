import React from "react";

type Props = {
  onNext: () => void;
  onPrev: () => void;
  currentPage: number;
  totalPages: number;
};

export default function Pagenation({
  onNext,
  onPrev,
  currentPage,
  totalPages,
}: Props) {
  return (
    <div>
      <button
        onClick={() => onPrev()}
        className="ml-4 bg-blue-400 text-white px-3 rounded hover:bg-brue-500 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-blue-400"
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <p className="inline-block mx-2">
        {currentPage} / {totalPages}
      </p>
      <button
        onClick={() => onNext()}
        className="ml-4 bg-blue-400 text-white px-3 rounded hover:bg-blue-500 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-blue-400"
        disabled={currentPage === totalPages || totalPages === 0}
      >
        Next
      </button>
    </div>
  );
}
