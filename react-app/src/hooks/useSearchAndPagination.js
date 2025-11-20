import { useState, useEffect, useMemo } from 'react';
import { UI_CONFIG } from '../config/constants.js';

/**
 * Custom hook for search and pagination functionality
 */
export const useSearchAndPagination = (items, itemsPerPage = UI_CONFIG.ITEMS_PER_PAGE) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Filter items based on search term
   */
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    return items.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  /**
   * Calculate pagination data
   */
  const paginationData = useMemo(() => {
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    return {
      currentItems,
      totalItems,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }, [filteredItems, currentPage, itemsPerPage]);

  /**
   * Reset to first page when search term changes
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /**
   * Adjust page if current page becomes empty after data changes
   */
  useEffect(() => {
    if (paginationData.currentItems.length === 0 && paginationData.totalPages > 0) {
      setCurrentPage(paginationData.totalPages);
    }
  }, [paginationData]);

  /**
   * Navigate to specific page
   */
  const goToPage = (page) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Go to next page
   */
  const nextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  /**
   * Go to previous page
   */
  const prevPage = () => {
    if (paginationData.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  /**
   * Update search term
   */
  const updateSearchTerm = (term) => {
    setSearchTerm(term);
  };

  return {
    searchTerm,
    setSearchTerm: updateSearchTerm,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    ...paginationData
  };
};