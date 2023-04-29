import FlowersDAO from "../dao/flowersDAO.js";

export default class FlowersController {
  static async apiGetFlowers(req, res, next) {
    const flowersPerPage = req.query.flowersPerPage
      ? parseInt(req.query.flowersPerPage)
      : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    let filters = {};
    if (req.query.rated) {
      filters.rated = req.query.rated;
    } else if (req.query.title) {
      filters.title = req.query.title;
    }

    const { flowersList, totalNumFlowers } = await FlowersDAO.getFlowers({
      filters,
      page,
      flowersPerPage,
    });

    let response = {
      flowers: flowersList,
      page: page,
      filters: filters,
      entries_per_page: flowersPerPage,
      total_results: totalNumFlowers,
    };
    res.json(response);
  }
}
