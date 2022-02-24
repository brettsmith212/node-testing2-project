exports.seed = function (knex) {
  return knex("cars")
    .truncate()
    .then(() => {
      return knex("cars").insert([
        { vin: "qwerqwer", make: "tesla", model: "model3" },
        { vin: "asdfasdf", make: "toyota", model: "camry" },
      ]);
    });
};
