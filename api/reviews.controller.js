import ReviewsDAO from "../dao/reviewsDAO.js";
import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;

export default class ReviewsController {
  static async apiGetReviews(req, res, next) {
    let movie_id = req.params.id;
    console.log("req.params.id", req.params.id);

    const reviewsList = await ReviewsDAO.getReviews(movie_id);

    let response = {
      reviews: reviewsList,
    };
    console.log("reviewsList: ", reviewsList);
    res.json(response);
  }

  static async apiPostReview(req, res, next) {
    try {
      console.log("apiPostReview");
      const movieId = req.body.movie_id;
      const review = req.body.review;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const date = new Date();

      // console.log(`API POST REVIEW DAO`);
      // console.log(`(apiPostReview) request body`, req.body);
      // console.lonodeg(`(apiPostReview) movieId: ${movieId}`);
      // console.log(`(apiPostReview) review: ${review}`);
      // console.log(`(apiPostReview) userInfo: ${userInfo}`);

      const AddReviewResponse = await ReviewsDAO.addReview(
        movieId,
        userInfo,
        review,
        date,
        new ObjectId()
      );

      console.log("AddReviewResponse", AddReviewResponse);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReviewById(req, res, next) {
    console.log(`apiUpdateReview req.body: `, req.body);
    // let review_id = req.params.review_id;
    let review_id = req.body.data.review_id;
    let review = req.body.data.review;
    let date = new Date();
    try {
      const UpdateReviewResponse = await ReviewsDAO.updateReviewById(
        review_id,
        review,
        date
      );

      console.log("Review Response: ", UpdateReviewResponse);

      if (UpdateReviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review. User might not be original poster"
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    // next()
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const userId = req.body.user_id;
      const DeleteReviewResponse = await ReviewsDAO.deleteReview(
        reviewId,
        userId
      );
      console.log("Review Response: ", DeleteReviewResponse);

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
