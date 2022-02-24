const express = require("express");
const Cars = require("./cars/cars-model");

const server = express();

server.use(express.json());

server.get("/cars", (req, res) => {
  res.status(200).json({ message: "GET WORKING" });
});

server.post("/cars", (req, res) => {
  res.status(201).json({ message: "POST WORKING" });
});

module.exports = server;
