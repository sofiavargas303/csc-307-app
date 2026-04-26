import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import {
  getUsers,
  findUserByName,
  findUserByJob,
  findUserByNameAndJob,
  findUserById,
  addUser,
  deleteUserById
} from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);

mongoose
  .connect(MONGO_CONNECTION_STRING + "users")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name && job) {
    findUserByNameAndJob(name, job)
      .then((result) => res.send({ users_list: result }))
      .catch((error) => res.status(500).send(error));
  } else if (name) {
    findUserByName(name)
      .then((result) => res.send({ users_list: result }))
      .catch((error) => res.status(500).send(error));
  } else if (job) {
    findUserByJob(job)
      .then((result) => res.send({ users_list: result }))
      .catch((error) => res.status(500).send(error));
  } else {
    getUsers()
      .then((result) => res.send({ users_list: result }))
      .catch((error) => res.status(500).send(error));
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  findUserById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => res.status(500).send(error));
});

app.post("/users", (req, res) => {
  addUser(req.body)
    .then((newUser) => res.status(201).send(newUser))
    .catch((error) => res.status(500).send(error));
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  deleteUserById(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => res.status(500).send(error));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});