const express = require("express");
const router = express.Router();
const path = require("path");
//const data = require(path.join(__dirname, "../database/database.js"))

router.get("/", (req, res, next) => {
  res.render("index", { title: "index" });
});
 
router.get("/about", (req, res) => {
  res.render("index", { title: "Über uns" });
});

/* router.get("/courses", async (req, res) => {
  res.render("index", { title: await data.getData() });
}); */

router.get("/about/:name", (req, res) => {
  // Übergeben von Parameter Name an Seitenrenderer
  res.render("index", { title: `Über uns ${req.params.name}` });
});

module.exports = router;