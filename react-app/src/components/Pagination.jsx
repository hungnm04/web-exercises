import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`pagination-nav-button ${
          currentPage === 1
            ? 'pagination-nav-button-disabled'
            : 'pagination-nav-button-enabled'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`pagination-button ${
            currentPage === i + 1
              ? 'pagination-button-active'
              : 'pagination-button-inactive'
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`pagination-nav-button ${
          currentPage === totalPages
            ? 'pagination-nav-button-disabled'
            : 'pagination-nav-button-enabled'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;