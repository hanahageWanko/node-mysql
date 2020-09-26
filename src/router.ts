import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    // index.ejsをレンダリング
    res.render("./index.ejs");
});

module.exports = router;
