const express = require("express");

const router = express.Router();

const commentApi = require("../../../controllers/api/v1/comments_api");

router.get("/", commentApi.index);

module.exports = router;
