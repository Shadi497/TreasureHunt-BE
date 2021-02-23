const express = require("express");
const passport = require("passport");

const {
  thingCreate,
  treasurethingList,
  thingList,
  fetchTreasure,
} = require("../controllers/thingController");

const router = express.Router();

router.param("thingId", async (req, res, next, thingId) => {
  const foundTreasure = await fetchTreasure(thingId, next);
  if (foundTreasure) {
    req.thing = foundTreasure;
    next();
  } else {
    next({
      status: 404,
      message: "Treasure not found",
    });
  }
});

//garbage list
router.get("/list", thingList);

//treasure list
router.get(
  "/treasurelist",
  passport.authenticate("jwt", { session: false }),
  treasurethingList
);

//create thing
router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  thingCreate
);

module.exports = router;
