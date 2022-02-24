const db = require("../../data/dbConfig");

function getAll() {
  return db("cars");
}

function getById(id) {
  return db("cars").where("id", id).first();
}

async function insert(car) {
  const [id] = await db("cars").insert(car);
  return getById(id);
}

module.exports = {
  getAll,
  getById,
  insert,
};
