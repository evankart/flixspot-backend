import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  static async apiGetReviews(req, res, next) {
    const reviewsList = await MoviesDAO.getReviews();

    let response = {
      movies: reviewsList,
      page: page,
      filters: filters,
      entries_per_page: moviesPerPage,
    };
    res.json(response);
  }

  static async apiPostReview(req, res) {
    try {
      const movieId = req.body.movie_id;
      const review = req.body.review;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const date = new Date();

      console.log(`API POST REVIEW DAO`);
      console.log(`(apiPostReview) request body`, req.body);
      console.log(`(apiPostReview) movieId: ${movieId}`);
      console.log(`(apiPostReview) review: ${review}`);
      console.log(`(apiPostReview) userInfo: ${userInfo}`);

      const ReviewResponse = await ReviewsDAO.addReview(
        movieId,
        userInfo,
        review,
        date
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res) {
    try {
      const reviewId = req.body.review_id;
      const review = req.body.review;
      const userId = req.body.user_id;
      const date = new Date();

      console.log(`API UPDATE REVIEW DAO`);
      console.log(`(apiUpdateReview) request body`, req.body);
      console.log(`(apiUpdateReview) reviewId: ${reviewId}`);
      console.log(`(apiUpdateReview) user.id: ${userId}`);
      console.log(`(apiUpdateReview) review: ${review}`);

      const ReviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        userId,
        review,
        date
      );

      console.log("Review Response: ", ReviewResponse);

      let { error } = ReviewResponse;
      if (error) {
        res.status.json({ error });
      }

      if (ReviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review. User might not be original poster"
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const userId = req.body.user_id;
      const ReviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
