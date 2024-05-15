/** Simple demo Express app. */

import express from "express";

const app = express();

// useful error class to throw
import { NotFoundError, BadRequestError }  from "./expressError.js";

// process JSON body => req.body
app.use(express.json());

// process traditional form data => req.body
app.use(express.urlencoded());

/** Homepage renders simple message. */

app.get("/", function (req, res) {
  return res.send("Hello World!");
});
// end home

const USERS = [];

/** Show info on instructor. */

app.get("/staff/:fname", function (req, res) {
  return res.send(`This instructor is ${req.params.fname}`);
});

/** Show JSON on instructor */

app.get("/api/staff/:fname", function (req, res) {
  return res.json({ fname: req.params.fname });
});
// end json

/** Add a new instructor. */

app.post("/api/staff", function (req, res) {
  if (req.body === undefined) throw new BadRequestError();
  // ... Do some database operation here...
  // ... then return something as JSON ...
  return res.json({
    fname: req.body.fname,
  });
});
// end post

/** Sample of returning status code */

app.get("/whoops", function (req, res) {
  return res
    .status(404)
    .json({ oops: "Nothing here!" });
});

/** Sample of validating / error handling */

app.get("/users/:id", function (req, res) {
  const user = USERS.find(u =>
      u.id === req.params.id
  );

  if (!user) {
    return res.status(404).json({ err: "No such user"});
  }

  return res.json({ user });
});
// end

/** Throwing Error */

app.get("/users2/:id", function (req, res) {
  const user = USERS.find(u =>
      u.id === req.params.id
  );

  if (!user) {
    throw new Error("No such user");
  }

  return res.json({ user });
});
// end

/** Throwing NotFoundError */

app.get("/users3/:id", function (req, res) {
  const user = USERS.find(u =>
      u.id === req.params.id
  );

  if (!user) {
    throw new NotFoundError("No such user");
  }

  return res.json({ user });
});
// end


/** 404 handler: matches unmatched routes. */
app.use(function (req, res) {
  throw new NotFoundError();
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});
// end


export default app;
