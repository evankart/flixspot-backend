import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;

let movies;

export default class MoviesDAO {
  static async injectDB(conn) {
    if (movies) {
      return;
    }
    try {
      movies = await conn.db(process.env.MOVIES_NS).collection("movies");
    } catch (e) {
      console.error(`unable to connect in MoviesDAO: ${e}`);
    }
  }

  static async getMovies({ filters, page = 0, moviesPerPage = 20 } = {}) {
    let query = {};
    let titleQuery;
    let ratedQuery;
    let title;
    let rated;

    console.log("filters: ", filters);
    if (filters) {
      if ("title" in filters) {
        title = filters["title"];
        query.$text = { $search: `${title}` };
        console.log(query);
      } else {
        title = undefined;
        titleQuery = null;
      }
      if ("rated" in filters) {
        rated = filters["rated"];
        // ratedQuery = { rated: { $eq: filters["rated"] } };
        query.rated = { $eq: `${rated}` };
        console.log(query);
      } else {
        rated = undefined;
        ratedQuery = null;
      }

      // query = {
      //   // $text: { $search: `'${title}'` },
      //   rated: { $eq: `'${rated}'` },
      // };
      // console.log(
      //   "queryTarget: ",
      //   "{ '$text': { '$search': 'white' }, rated: {'$eq': 'PG'} }"
      // );
      // console.log("query: ", query);
    }
    let cursor;
    try {
      cursor = await movies
        .find(query)
        .limit(moviesPerPage)
        .skip(moviesPerPage * page);
      const moviesList = await cursor.toArray();
      const totalNumMovies = await movies.countDocuments(query);
      return { moviesList, totalNumMovies };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }
  }

  static async getRatings() {
    let ratings = [];
    try {
      ratings = await movies.distinct("rated");
      return ratings;
    } catch (e) {
      console.error(`unable to get ratings, ${e}`);
      return ratings;
    }
  }

  static async apiGetMovieById(id) {
    try {
      return await movies
        .aggregate([
          {
            $match: { _id: new ObjectId(id) },
          },
          {
            $lookup: {
              from: "reviews",
              localField: "_id",
              foreignField: "movie_id",
              as: "reviews",
            },
          },
        ])
        .next();
    } catch (e) {
      console.error(`something went wrong in getMovieById: ${e}`);
      throw e;
    }
  }

  static async updateMoviebyId(movieId, newTitle) {
    console.log(`newTitle: ${newTitle}`);
    try {
      const updateResponse = await movies.updateOne(
        { _id: new ObjectId(movieId) },
        { $set: { title: newTitle } }
      );
      console.log(updateResponse);
      return updateResponse;
    } catch (e) {
      console.error(`error updating review: ${e}`);
      return { error: e };
    }
  }
}
