'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  subcategory: string;
  size: string[];
  colors: string[];
  material: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  popularity: number;
  tags: string[];
}

interface CategoryFilterProps {
  filters: {
    subcategory: string;
    size: string;
    color: string;
    priceRange: number[];
    rating: number;
    material: string;
    reviewCount: number;
    tags: string[];
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  products: Product[];
  category: string;
}

export default function CategoryFilter({
  filters,
  onFilterChange,
  onClearFilters,
  products,
  category
}: CategoryFilterProps) {
  const [priceRange, setPriceRange] = useState(filters.priceRange);

  // Extract unique values from products
  const uniqueSizes = [...new Set(products.flatMap(p => p.size))].sort();
  const uniqueColors = [...new Set(products.flatMap(p => p.colors))].sort();
  const uniqueMaterials = [...new Set(products.map(p => p.material))].sort();
  const uniqueTags = [...new Set(products.flatMap(p => p.tags))].sort();

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, rating: filters.rating === rating ? 0 : rating });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFilterChange({ ...filters, tags: newTags });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`ri-star-${i < rating ? 'fill' : 'line'} text-yellow-400 text-sm`}
      />
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Size Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Size</h4>
          <div className="grid grid-cols-3 gap-2">
            {uniqueSizes.map((size) => (
              <button
                key={size}
                onClick={() => onFilterChange({ ...filters, size: filters.size === size ? '' : size })}
                className={`px-3 py-2 text-sm border rounded transition-all ${
                  filters.size === size
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Color</h4>
          <div className="grid grid-cols-2 gap-2">
            {uniqueColors.map((color) => (
              <button
                key={color}
                onClick={() => onFilterChange({ ...filters, color: filters.color === color ? '' : color })}
                className={`px-3 py-2 text-sm border rounded transition-all text-left ${
                  filters.color === color
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                min="0"
                max="1000"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value) || 500)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                min="0"
                max="1000"
              />
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$500+</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Rating</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex items-center space-x-2 w-full px-3 py-2 text-sm border rounded transition-all ${
                  filters.rating === rating
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-1">
                  {renderStars(rating)}
                </div>
                <span>& up</span>
              </button>
            ))}
          </div>
        </div>

        {/* Material Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Material</h4>
          <div className="space-y-2">
            {uniqueMaterials.slice(0, 8).map((material) => (
              <button
                key={material}
                onClick={() => onFilterChange({ ...filters, material: filters.material === material ? '' : material })}
                className={`w-full px-3 py-2 text-sm border rounded transition-all text-left ${
                  filters.material === material
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {material}
              </button>
            ))}
          </div>
        </div>

        {/* Review Count Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Minimum Reviews</h4>
          <div className="space-y-2">
            {[100, 50, 25, 10].map((count) => (
              <button
                key={count}
                onClick={() => onFilterChange({ ...filters, reviewCount: filters.reviewCount === count ? 0 : count })}
                className={`w-full px-3 py-2 text-sm border rounded transition-all text-left ${
                  filters.reviewCount === count
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {count}+ reviews
              </button>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {uniqueTags.slice(0, 12).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 text-xs border rounded-full transition-all ${
                  filters.tags.includes(tag)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}