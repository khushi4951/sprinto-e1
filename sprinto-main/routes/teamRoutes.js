const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const { get, add, update } = require("../controllers/teamController");

const router = express.Router();

router.get("/", requireAuth, get);
router.post("/", requireAuth, add);
router.patch("/:id", requireAuth, update);

module.exports = router;

