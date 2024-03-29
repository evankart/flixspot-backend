import MoviesDAO from "../dao/moviesDAO.js";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const moviesPerPage = req.query.moviesPerPage
      ? parseInt(req.query.moviesPerPage)
      : 12;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    console.log("request: ", req.query);
    let filters = {};
    if (req.query["$rated"]) {
      filters.rated = req.query["$rated"];
      console.log("filters: ", filters);
    }
    if (req.query.title) {
      filters.title = req.query.title;
      console.log("filters: ", filters);
    }

    const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
      filters,
      page,
      moviesPerPage,
    });

    let response = {
      movies: moviesList,
      page: page,
      filters: filters,
      entries_per_page: moviesPerPage,
      total_results: totalNumMovies,
    };
    res.json(response);
  }

  static async apiGetMovieById(req, res, next) {
    try {
      let id = req.params.id || {};
      let movie = await MoviesDAO.apiGetMovieById(id);
      if (!movie) {
        res.status(404).json({ error: "not found" });
        return;
      }
      res.json(movie);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiUpdateMovieById(req, res, next) {
    console.log("apiUdateMovieById req.body: ", req.body);

    let movieId = req.params.id;
    let newTitle = req.body.newTitle;
    try {
      let movieResponse = await MoviesDAO.updateMoviebyId(movieId, newTitle);
      res.json(movieResponse);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }

    // console.log("apiUdateMovieById req: ", req);

    console.log("apiUdateMovieById req.params: ", req.params);
    console.log("apiUdateMovieById req.params.id: ", req.params.id);
  }

  static async apiGetRatings(req, res, next) {
    try {
      let propertyTypes = await MoviesDAO.getRatings();
      res.json(propertyTypes);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
