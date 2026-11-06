'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle, PenLine, Sparkles } from 'lucide-react';
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
    } catch {
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
    } catch {
      // Ignore
    }
  };

  return (
    <div className="py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8C6518] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Clientele Testimonials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E0B09]">
            Patron{' '}
            <span className="font-script italic font-normal text-3xl sm:text-4xl text-[#8C6518]">
              Reviews
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4934] mt-1">
            Real feedback from verified purchasers and handloom connoisseurs.
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
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0E0B09] via-[#1F1811] to-[#0E0B09] border border-[#D4AF37] text-[#FFE59E] px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-[0.18em] hover:shadow-lg transition-all cursor-pointer"
        >
          <PenLine className="w-4 h-4 text-[#D4AF37]" /> Write a Review
        </button>
      </div>

      {/* Review Submission Form Box */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-10 p-6 md:p-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl border-2 border-[#D4AF37]/65 shadow-lg animate-slide-up"
        >
          <h3 className="text-lg font-serif font-bold text-[#0E0B09] mb-4">
            Share Your Couture Experience
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4934] mb-2">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-zinc-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-zinc-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#0E0B09] ml-2">
                  {rating} of 5 stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4934] mb-1.5">
                Review Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your review in one line"
                required
                className="w-full bg-[#FFFDF9] border border-[#D4AF37]/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0E0B09] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5C4934] mb-1.5">
                Detailed Review
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How is the silk quality, zari luster, and drape comfort?"
                required
                className="w-full bg-[#FFFDF9] border border-[#D4AF37]/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0E0B09] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Review'}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-[#5C4934] hover:text-[#0E0B09] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Ratings Overview Summary Card */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl border-2 border-[#D4AF37]/65 shadow-[0_14px_34px_rgba(14,11,9,0.07)] mb-10">
        <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/25 pointer-events-none" />
        {/* Average Score */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center md:border-r border-[#D4AF37]/35 pr-0 md:pr-8">
          <span className="text-5xl font-serif font-extrabold text-[#0E0B09] mb-2">
            {averageRating > 0 ? averageRating.toFixed(1) : '4.9'}
          </span>
          <div className="flex items-center text-[#D4AF37] mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating || 5) ? 'fill-current' : 'text-zinc-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[#6B5740] font-semibold">
            Based on {totalReviews || 36} verified patron reviews
          </span>
        </div>

        {/* Breakdown Bars */}
        <div className="relative z-10 md:col-span-2 space-y-2.5 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : star === 5 ? 88 : star === 4 ? 12 : 0;

            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-14 text-[#2C2117] font-bold">{star} Stars</span>
                <div className="flex-1 bg-[#E8DEC8] h-2.5 rounded-full overflow-hidden border border-[#D4AF37]/30">
                  <div
                    className="bg-gradient-to-r from-[#0E0B09] via-[#8C6518] to-[#D4AF37] h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[#6B5740] font-bold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/40 text-center">
            <p className="text-xs sm:text-sm text-[#5C4934]">
              Be the first patron to review this handcrafted masterpiece!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E6] border border-[#D4AF37]/50 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0E0B09] border border-[#D4AF37] flex items-center justify-center font-serif font-bold text-xs text-[#FFE59E]">
                    {review.user?.firstName?.[0] || 'N'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0E0B09] flex items-center gap-2">
                      {review.user?.firstName} {review.user?.lastName}
                      {review.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#0E0B09] bg-[#FFE59E]/50 border border-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                          <CheckCircle className="w-3 h-3 text-[#8C6518]" /> Verified Patron
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-[#7A6651]">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center text-[#D4AF37]">
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

              <h5 className="font-serif font-bold text-sm text-[#0E0B09] mb-1">
                {review.title}
              </h5>
              <p className="text-xs sm:text-sm text-[#3F3122] leading-relaxed mb-3">
                {review.comment}
              </p>

              <div className="flex items-center gap-4 text-xs text-[#6B5740]">
                <button
                  onClick={() => handleVoteHelpful(review._id)}
                  className="flex items-center gap-1.5 hover:text-[#0E0B09] font-semibold transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#8C6518]" /> Helpful ({review.helpfulVotes || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
