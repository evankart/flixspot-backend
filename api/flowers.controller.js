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

  static async apiGetFlowerById(req, res, next) {
    try {
      let id = req.params.id || {};
      let flower = await FlowersDAO.apiGetFlowerById(id);
      if (!flower) {
        res.status(404).json({ error: "not found" });
        return;
      }
      res.json(flower);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetRatings(req, res, next) {
    try {
      let propertyTypes = await FlowersDAO.getRatings();
      res.json(propertyTypes);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
