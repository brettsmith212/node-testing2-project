const Cars = require("./cars/cars-model");
const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("./server");

const sampleCar1 = {
  vin: "123",
  make: "Porshe",
  model: "911",
};
const sampleCar2 = {
  vin: "456",
  make: "Tesla",
  model: "Model X",
};
const sampleCar3 = {
  vin: "789",
  make: "Honda",
  model: "Civic",
};

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("cars").truncate();
});

test("verify we are using the correct environment", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

describe("test server endpoints", () => {
  test("[GET] /cars returns status 200", async () => {
    const result = await request(server).get("/cars");
    expect(result.status).toBe(200);
  });

  test("[GET] /cars | returns empty array", async () => {
    const result = await request(server).get("/cars");
    expect(result.body).toBeInstanceOf(Array);
    expect(result.body).toHaveLength(0);
  });

  test("[GET] /cars | returns full array", async () => {
    await Cars.insert(sampleCar1);
    await Cars.insert(sampleCar2);
    await Cars.insert(sampleCar3);

    let result = await request(server).get("/cars");
    expect(result.body[0].vin).toBe(sampleCar1.vin);
    expect(result.body[1].vin).toBe(sampleCar2.vin);
    expect(result.body[2].vin).toBe(sampleCar3.vin);
  });

  test("[GET] /cars/:id", async () => {
    let result = await Cars.insert(sampleCar1);
    result = await request(server).get(`/cars/${result.id}`);
    expect(result.body.vin).toBe(sampleCar1.vin);
  });

  test("[GET] /cars/:id | returns ID not found with incorrect ID", async () => {
    let result = await Cars.insert(sampleCar1);
    result = await request(server).get(`/cars/2`);

    expect(result.text).toEqual(expect.stringMatching(/ID not found/i));
  });

  test("[POST] /cars", async () => {
    let result = await request(server).post("/cars").send(sampleCar1);
    expect(result.status).toBe(201);

    result = await Cars.getById(1);
    expect(result.vin).toBe(sampleCar1.vin);
  });

  test("[POST] /cars | returns status 422 when missing vin", async () => {
    let result = await request(server)
      .post("/cars")
      .send({ make: "makeTest", model: "modelTest" });
    expect(result.status).toBe(422);
  });

  test("[POST] /cars | returns status 422 when missing make", async () => {
    let result = await request(server)
      .post("/cars")
      .send({ vin: "123", model: "modelTest" });
    expect(result.status).toBe(422);
  });

  test("[POST] /cars | returns status 422 when missing model", async () => {
    let result = await request(server)
      .post("/cars")
      .send({ vin: "123", make: "makeTest" });
    expect(result.status).toBe(422);
  });

  test("[POST] /cars | returns this `vin is already taken` when vin is duplicated", async () => {
    await request(server).post("/cars").send(sampleCar1);
    let result = await request(server).post("/cars").send(sampleCar1);
    console.log(result.text);
    expect(result.text).toEqual(
      expect.stringMatching(/this vin is already taken/i)
    );
  });
});
