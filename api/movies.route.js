import express from "express";
import MoviesController from "./movies.controller.js";
import ReviewsController from "./reviews.controller.js";

const router = express.Router();

// GET all movies
router.get("/", MoviesController.apiGetMovies);

// GET reviews by id
router.get("/:id/review", ReviewsController.apiGetReviews);

// UPDATE review by id
router.put("/:review_id", ReviewsController.apiUpdateReviewById);

// GET or UPDATE movie by Id
router.get("/:id", MoviesController.apiGetMovieById);
// .put("/:id", MoviesController.apiUpdateMovieById);

// Get ratings
router.get("/ratings", MoviesController.apiGetRatings);

/* REVIEWS */
// POST movie review
// PUT (edit) movie review
// DELETE movie review
router
  .route("/review")
  .post(ReviewsController.apiPostReview)
  .delete(ReviewsController.apiDeleteReview);

export default router;
