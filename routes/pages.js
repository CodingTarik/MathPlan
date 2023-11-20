const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("layout/index", {
    body: "../pages/startpage.ejs",
    title: "Startseite",
  });
});

const internPath = path.join(__dirname, "..", "client", "build", "intern");
console.log("Intern Path:", internPath);

router.get("/intern", (req, res, next) => {
  res.render("layout/index", { body: "../../client/build/intern/index.html" });
});
router.use(
  "/intern",
  express.static(internPath, { index: false, redirect: false })
);

router.get("/about/:name", (req, res) => {
  // Übergeben von Parameter Name an Seitenrenderer
  res.render("index", { title: `Über uns ${req.params.name}` });
});

module.exports = router;
