import express from "express";
import MoviesController from "./movies.controller.js";
import ReviewsController from "./reviews.controller.js";

const router = express.Router();

// GET all movies
router.get("/", MoviesController.apiGetMovies);

// GET reviews by id
router.get("/review", ReviewsController.apiGetReviews);

// GET movie by Id
router.get("/:id", MoviesController.apiGetMovieById);

// Get ratings
router.get("/ratings", MoviesController.apiGetRatings);

/* REVIEWS */
// POST movie review
// PUT (edit) movie review
// DELETE movie review
router
  .route("/review")
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview);

export default router;
