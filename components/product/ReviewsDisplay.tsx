"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import ReviewForm from "./ReviewForm";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
  images?: string[];
}

interface ReviewsDisplayProps {
  productId: string;
  averageRating?: number;
  totalReviews?: number;
}

// Demo reviews for when backend is unreachable
const demoReviews: Review[] = [
  {
    id: "r-1",
    author: "Ahmed M.",
    rating: 5,
    title: "Best running shoes I've ever owned",
    content: "These shoes are incredibly comfortable and lightweight. I've been running 5K daily for the past month and they still feel like new. The cushioning is perfect for long distances.",
    date: "2025-12-15",
    helpful: 24,
    verified: true,
  },
  {
    id: "r-2",
    author: "Sara K.",
    rating: 4,
    title: "Great quality, runs slightly small",
    content: "The quality is excellent and they look amazing. My only note is that they run about half a size small - I'd recommend ordering one size up. Once I got the right size, they were perfect.",
    date: "2025-11-28",
    helpful: 18,
    verified: true,
  },
  {
    id: "r-3",
    author: "Mohamed A.",
    rating: 5,
    title: "Worth every penny",
    content: "I was hesitant about the price but these shoes are worth every penny. The support and comfort are unmatched. Great for both running and casual wear.",
    date: "2025-11-10",
    helpful: 12,
    verified: true,
  },
  {
    id: "r-4",
    author: "Nour E.",
    rating: 3,
    title: "Good but not what I expected",
    content: "The shoes are well-made but the color was slightly different from what was shown in the photos. Still decent shoes overall, just not exactly what I expected.",
    date: "2025-10-22",
    helpful: 5,
    verified: false,
  },
];

export default function ReviewsDisplay({ productId: _productId, averageRating = 4.3, totalReviews = 4 }: ReviewsDisplayProps) {
  const [showForm, setShowForm] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set());

  const ratingDistribution = [
    { stars: 5, count: 2, percentage: 50 },
    { stars: 4, count: 1, percentage: 25 },
    { stars: 3, count: 1, percentage: 25 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const handleHelpful = (reviewId: string) => {
    if (!helpfulIds.has(reviewId)) {
      setHelpfulIds(new Set([...helpfulIds, reviewId]));
    }
  };

  const handleSubmitReview = async (data: { rating: number; title: string; content: string; images: string[] }) => {
    // In production, this would submit to the backend
    console.log("Review submitted:", data);
    setShowForm(false);
  };

  return (
    <div>
      {/* Summary Header */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-outfit text-5xl font-extrabold text-neutral-900">{averageRating}</span>
            <span className="text-neutral-500">/5</span>
          </div>
          <div className="flex items-center gap-1 mb-2 justify-center md:justify-start">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-neutral-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-neutral-600">Based on {totalReviews} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-700 w-8">{item.stars}★</span>
              <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm text-neutral-500 w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="mb-8">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors"
          >
            Write a Review
          </button>
        ) : (
          <ReviewForm
            onSubmit={handleSubmitReview}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {demoReviews.map((review) => (
          <div key={review.id} className="border-b border-neutral-200 pb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-neutral-900">{review.title}</h4>
              </div>
              <span className="text-sm text-neutral-500">{review.date}</span>
            </div>

            <p className="text-neutral-700 text-sm leading-relaxed mb-3">{review.content}</p>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-neutral-700">{review.author}</span>
              <button
                onClick={() => handleHelpful(review.id)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  helpfulIds.has(review.id)
                    ? "text-primary-600 font-medium"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
                aria-label={`Mark review as helpful (${review.helpful + (helpfulIds.has(review.id) ? 1 : 0)} people found this helpful)`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                Helpful ({review.helpful + (helpfulIds.has(review.id) ? 1 : 0)})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
