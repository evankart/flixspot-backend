import express from "express";
import FlowersController from "./flowers.controller.js";
import ReviewsController from "./reviews.controller.js";

const router = express.Router();

router.route("/").get(FlowersController.apiGetFlowers);
router.route("/id/:id").get(FlowersController.apiGetFlowerById);
router.route("/ratings").get(FlowersController.apiGetRatings);

router
  .route("/review")
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview)
  .delete(ReviewsController.apiDeleteReview);

export default router;
