"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchStore } from "@/store/search-store";
import { categories } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export function SearchModal() {
  const { isOpen, closeSearch, query, setQuery, getResults, getPopularSearches } =
    useSearchStore();
  const results = getResults();
  const popular = getPopularSearches();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
        onClick={closeSearch}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="mx-auto mt-20 max-w-2xl px-6"
        >
          <div className="flex items-center gap-4 border-b border-ivory/20 pb-4">
            <Search className="h-5 w-5 text-gold" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search breads, cakes, gifting..."
              className="flex-1 bg-transparent text-lg text-ivory outline-none placeholder:text-ivory/40"
            />
            <button onClick={closeSearch} aria-label="Close search">
              <X className="h-5 w-5 text-ivory/60" />
            </button>
          </div>

          <div className="mt-8 max-h-[60vh] overflow-y-auto">
            {query.length === 0 ? (
              <>
                <p className="text-xs uppercase tracking-widest text-muted">Popular Searches</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {popular.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="border border-ivory/20 px-4 py-2 text-sm text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <p className="mt-8 text-xs uppercase tracking-widest text-muted">Categories</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`#category-${cat.id}`}
                      onClick={closeSearch}
                      className="px-4 py-3 text-sm text-ivory/70 transition-colors hover:text-gold"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={closeSearch}
                    className="flex items-center gap-4 p-3 transition-colors hover:bg-ivory/5"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-ivory">{product.name}</p>
                      <p className="text-xs text-muted capitalize">{product.category.replace("-", " ")}</p>
                    </div>
                    <span className="text-sm text-gold">{formatPrice(product.price)}</span>
                    <ArrowRight className="h-4 w-4 text-ivory/40" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-ivory/50">No products found for &ldquo;{query}&rdquo;</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
