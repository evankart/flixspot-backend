import express from "express";
import MoviesController from "./movies.controller.js";
import ReviewsController from "./reviews.controller.js";

const router = express.Router();

// GET all movies
router.get("/", MoviesController.apiGetMovies);

// GET movie by Id
router.get("/:id", MoviesController.apiGetMovieById);

// Get ratings
router.get("/ratings", MoviesController.apiGetRatings);

/* REVIEWS */
// POST movie review
router.post("/review", ReviewsController.apiPostReview);

// PUT (edit) movie review
router.put("/review", ReviewsController.apiUpdateReview);

// DELETE movie review
router.delete("/review", ReviewsController.apiDeleteReview);

export default router;
