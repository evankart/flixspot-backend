import mongodb from "mongodb";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

const ObjectId = mongodb.ObjectId;
let reviews;

dotenv.config();

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: process.env.PG_USER,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
});

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected to postgres db");
  }
});

// async function addUser(userId, userName) {
//   try {
//     const result = await pool.query(
//       "INSERT INTO users (new_id, username) VALUES ($1, $2) RETURNING *",
//       [userId, userName]
//     );
//     console.log(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//   }
// }

pool.query("SELECT * FROM users").then((res) => {
  console.log(res.rows);
});

// addUser(1, "John Doe");

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
      console.log("addReview");
      pool.query("SELECT * FROM users").then((res) => {
        console.log(res.rows);
      });
      const text =
        "INSERT INTO users(username, new_id) VALUES ($1, $2) RETURNING *";
      const values = [user.name, parseInt(user._id.substring(6))];
      console.log("values: ", values);
      pool.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(res.rows[0]);
        }
      });
    } catch (err) {
      console.error(err);
    }

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

  static async updateReviewById(review_id, review, date) {
    console.log(`REVIEWSDAO updateReview`);
    console.log(`(reviewsDAO) review_id ${review_id}`);
    console.log(`(reviewsDAO) review: ${review}`);
    console.log(`(reviewsDAO) date: ${date}`);

    try {
      const updateResponse = await reviews.updateOne(
        { _id: new ObjectId(review_id) },
        { $set: { review: review, date: date } }
      );

      console.log("updateResponse: ", updateResponse);
      return updateResponse;
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
