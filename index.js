import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesDAO from "./dao/moviesDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";
import fetch from "node-fetch";
// import pkg from "pg";
// const { Pool } = pkg;

async function main() {
  // dotenv.config();

  // const pool = new Pool({
  //   host: "localhost",
  //   port: 5432,
  //   user: process.env.PG_USER,
  //   database: process.env.PG_DB,
  //   password: process.env.PG_PASSWORD,
  // });

  // pool.connect((err) => {
  //   if (err) {
  //     console.error("connection error", err.stack);
  //   } else {
  //     console.log("connected to postgres db");
  //   }
  // });

  // async function addUser(userId, userName) {
  //   try {
  //     const result = await pool.query(
  //       "INSERT INTO users (id, username) VALUES ($1, $2) RETURNING *",
  //       [userId, userName]
  //     );
  //     console.log(result.rows[0]);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // pool.query("SELECT * FROM users").then((res) => {
  //   console.log(res.rows);
  // });

  // addUser(1, "John Doe");

  // pool.end();

  //themoviedb
  const url = "https://api.themoviedb.org/3/authentication";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MmE1N2RkYjU4NDVjODY1OWFmY2FlMjhhMDhiMjJmNiIsInN1YiI6IjY1Y2E5N2MzMTI5NzBjMDE3YmM1NWFiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nJn5j2iz8sMUouM62xtJo5d4bstYzgmdp8HFVJD6Wio",
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));

  const client = new mongodb.MongoClient(process.env.MOVIES_DB_URI);
  const port = process.env.PORT || 8000;

  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    await MoviesDAO.injectDB(client);

    await ReviewsDAO.injectDB(client);

    app.listen(port, () => {
      console.log("Server is running on port" + port);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main().catch(console.error);
