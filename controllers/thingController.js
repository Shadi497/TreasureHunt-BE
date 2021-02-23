const { Thing } = require("../db/models");

exports.fetchThing = async (thingId, next) => {
  try {
    const foundThing = await Thing.findByPk(thingId);
    if (foundThing) return foundThing;
    else next({ message: "Thing does not exist" });
  } catch (error) {
    next(error);
  }
};

exports.thingList = async (req, res, next) => {
  try {
    const things = await Thing.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        isTreasure: false,
      },
    });
    res.status(200).json(things);
  } catch (error) {
    next(error);
  }
};

exports.treasurethingList = async (req, res, next) => {
  try {
    const things = await Thing.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        isTreasure: true,
      },
    });
    res.status(200).json(things);
  } catch (error) {
    next(error);
  }
};

exports.thingCreate = async (req, res, next) => {
  try {
    //   const foundTreasure = await Treasure.findOne({
    //     where: {
    //       userId: req.user.id,
    //     },
    //   });
    //   if (foundTreasure) {
    //     next({
    //       status: 400,
    //       message: "You already have one Treasure !!",
    //     });
    //   } else {

    req.body.userId = req.user.id;
    const newThing = await Thing.create(req.body);
    res.status(201).json(newThing);
    //   }
  } catch (error) {
    next(error);
  }
};
