let flowers;

export default class FlowersDAO {
  static async injectDB(conn) {
    if (flowers) {
      return;
    }
    try {
      flowers = await conn.db(process.env.FLOWERS_NS).collection("movies");
    } catch (e) {
      console.error(`unable to connect in FlowersDAO: ${e}`);
    }
  }

  static async getFlowers({
    filters = null,
    page = 0,
    flowersPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } };
      } else if ("rated" in filters) {
        query = { rated: { $eq: filters["rated"] } };
      }
    }
    let cursor;
    try {
      cursor = await flowers
        .find(query)
        .limit(flowersPerPage)
        .skip(flowersPerPage * page);
      const flowersList = await cursor.toArray();
      const totalNumFlowers = await flowers.countDocuments(query);
      return { flowersList, totalNumFlowers };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { flowersList: [], totalNumFlowers: 0 };
    }
  }
}
