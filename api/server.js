const express = require("express");
const Cars = require("./cars/cars-model");
const {
  validateCarInput,
  checkVinUnique,
  checkIdExists,
} = require("./cars/cars-middleware");

const server = express();

server.use(express.json());

server.get("/cars", async (req, res) => {
  let result = await Cars.getAll();
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ message: "error getting cars" });
  }
});

server.get("/cars/:id", checkIdExists, async (req, res) => {
  let result = await Cars.getById(req.params.id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ message: "error finding car" });
  }
});

server.post("/cars", validateCarInput, checkVinUnique, async (req, res) => {
  let result = await Cars.insert(req.body);
  if (result) {
    res.status(201).json(result);
  } else {
    res.status(500).json({ message: "error adding car" });
  }
});

module.exports = server;
