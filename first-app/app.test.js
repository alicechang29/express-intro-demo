process.env.NODE_ENV = "test";

import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "./app.js";


test("GET /", async function () {
  const resp = await request(app).get(`/`);
  expect(resp.text).toEqual("Hello World!");
});

test("GET /staff/:fname", async function () {
  const resp = await request(app).get(`/staff/joel`);
  expect(resp.text).toEqual("This instructor is joel");
});

test("GET /api/staff/:fname", async function () {
  const resp = await request(app).get(`/api/staff/joel`);
  expect(resp.body).toEqual({ fname: "joel" });
});

test("POST /api/staff", async function () {
  const resp = await request(app).post(`/api/staff`).send({ fname: "ezra" });
  expect(resp.body).toEqual({ fname: "ezra" });
});

test("POST /api/staff throws error if no request body", async function () {
  const resp = await request(app).post(`/api/staff`).send();
  expect(resp.statusCode).toEqual(400);
});

test("GET /whoops", async function () {
  const resp = await request(app).get(`/whoops`);
  expect(resp.status).toEqual(404);
  expect(resp.body).toEqual({ oops: "Nothing here!" });
});