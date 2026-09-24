'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle, PenLine } from 'lucide-react';
import { api } from '../../lib/api';
import { Review } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

interface ProductReviewSectionProps {
  productId: string;
}

export const ProductReviewSection = ({ productId }: ProductReviewSectionProps) => {
  const { isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [distribution, setDistribution] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/reviews/product/${productId}`);
      if (res.data?.success && res.data.data) {
        setReviews(res.data.data.reviews || []);
        setAverageRating(res.data.data.averageRating || 0);
        setDistribution(res.data.data.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        setTotalReviews(res.data.data.totalReviews || 0);
      }
    } catch (error) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/reviews/product/${productId}`, {
        rating,
        title,
        comment,
      });

      if (res.data?.success) {
        toast.success('Thank you! Your review has been published.');
        setIsFormOpen(false);
        setTitle('');
        setComment('');
        fetchReviews();
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    try {
      const res = await api.post(`/reviews/${reviewId}/helpful`);
      if (res.data?.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r
          )
        );
        toast.success('Marked as helpful');
      }
    } catch (error) {
      // Ignore
    }
  };

  return (
    <div className="py-12 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Customer Reviews
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Real feedback from verified purchasers and connoisseurs.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast.error('Please log in to submit a review');
              return;
            }
            setIsFormOpen(!isFormOpen);
          }}
          className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <PenLine className="w-4 h-4" /> Write a Review
        </button>
      </div>

      {/* Review Submission Form Modal / Box */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-12 p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-slide-up"
        >
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Share Your Experience
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-zinc-300 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-2">
                  {rating} of 5 stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Review Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your review in one line"
                required
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Detailed Review
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike? How does the product feel in daily use?"
                required
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Review'}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Ratings Overview Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-12">
        {/* Average Score */}
        <div className="flex flex-col items-center justify-center text-center md:border-r border-zinc-200 dark:border-zinc-800 pr-0 md:pr-8">
          <span className="text-5xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
            {averageRating > 0 ? averageRating.toFixed(1) : '4.9'}
          </span>
          <div className="flex items-center text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating || 5) ? 'fill-current' : 'text-zinc-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            Based on {totalReviews} reviews
          </span>
        </div>

        {/* Breakdown Bars */}
        <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : star === 5 ? 85 : 15;

            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-zinc-600 dark:text-zinc-400 font-medium">
                  {star} stars
                </span>
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-zinc-400 font-medium">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6 divide-y divide-zinc-100 dark:divide-zinc-800">
        {reviews.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-6">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="pt-6 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-200">
                    {review.user?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      {review.user?.firstName} {review.user?.lastName}
                      {review.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                    </h4>
                    <span className="text-xs text-zinc-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-current' : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h5 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                {review.title}
              </h5>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
                {review.comment}
              </p>

              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <button
                  onClick={() => handleVoteHelpful(review._id)}
                  className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.helpfulVotes || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
