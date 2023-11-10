const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index", { title: "index" });
});
 
router.get("/about", (req, res) => {
  res.render("index", { title: "Über uns" });
});

router.get("/about/:name", (req, res) => {
  // Übergeben von Parameter Name an Seitenrenderer
  res.render("index", { title: `Über uns ${req.params.name}` });
});

module.exports = router;