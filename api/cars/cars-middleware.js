const Cars = require("./cars-model");

const validateCarInput = (req, res, next) => {
  if (!req.body.vin || typeof req.body.vin !== "string") {
    res.status(422).json({ message: "vin is required and must be a string" });
    return;
  } else if (!req.body.make || typeof req.body.make !== "string") {
    res.status(422).json({ message: "make is required and must be a string" });
    return;
  } else if (!req.body.model || typeof req.body.model !== "string") {
    res.status(422).json({ message: "model is required and must be a string" });
    return;
  } else {
    next();
  }
};

const checkVinUnique = async (req, res, next) => {
  const cars = await Cars.getAll();
  const vinArr = cars.filter((car) => car.vin === req.body.vin);

  if (vinArr.length > 0) {
    res.status(422).json({ message: "this vin is already taken" });
    return;
  } else {
    next();
  }
};

module.exports = {
  validateCarInput,
  checkVinUnique,
};
