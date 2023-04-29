import express from "express";
import FlowersController from "./flowers.controller.js";

const router = express.Router();

router.route("/").get(FlowersController.apiGetFlowers);

export default router;
