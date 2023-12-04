import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn
        // Movie reviews NS
        .db(process.env.MOVIES_NS)
        .collection("reviews");
    } catch (e) {
      console.error(`unable to establish connection handle in reviewDAO: ${e}`);
    }
  }

  static async getReviews(movie_id) {
    let cursor;
    console.log(movie_id);
    try {
      cursor = await reviews.find({ movie_id: new ObjectId(movie_id) });
      const reviewsList = await cursor.toArray();
      console.log("reviewsList: ", reviewsList);
      return { reviewsList };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { reviewsList: [] };
    }
  }

  static async addReview(movieId, user, review, date, review_id) {
    try {
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        review: review,
        movie_id: new ObjectId(movieId),
        _id: review_id,
      };

      console.log(reviewDoc);

      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async updateReviewById(review_id, review) {
    console.log(`REVIEWSDAO updateReview`);
    // console.log(`(reviewsDAO) reviewId`, reviewId);
    // console.log(`(reviewsDAO) userId: ${userId}`);
    // console.log(`(reviewsDAO) review: ${review}`);
    // console.log(`(reviewsDAO) date: ${date}`);

    const filter = { _id: Object("6568e39497f664516683f6bc") };
    const update = {
      $set: {
        review: "UPDATED REVIEW",
      },
    };

    try {
      const updateResponse = await reviews.updateOne(
        { _id: new ObjectId(review_id) },
        { $set: { review: review } }
      );

      console.log(updateResponse);
      return updateResponse;

      // try {
      //   const updateResponse = await reviews.updateOne(
      //     { _id: new Object(reviewId), user_id: userId },
      //     { $set: { review: review, date: date } }
      //   );
      //   return updateResponse;
    } catch (e) {
      console.error(`error updating review: ${e}`);
      return { error: e };
    }
  }

  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
        user_id: userId,
      });
      return deleteResponse;
    } catch (e) {
      console.error(`unable to delete review: ${e}`);
      return { error: e };
    }
  }
}
