// @ts-check
const fs = require("fs");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const { parse, isWithinInterval } = require("date-fns");
const initData = require("./initData");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const { PORT = 8080, DATA_DIR = path.resolve(__dirname, "..", "data") } = process.env;

const { events, users, projects } = initData();

/* timer for writing events to fs */
let persistEvents = null;

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "dist")));

app.use(express.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.get("/api/events", (req, res) => {
  const start = parse(req.query.start, "yyyy-MM-dd", 0);
  const end = parse(req.query.end, "yyyy-MM-dd", 0);
  res.json(
    events.filter(item => {
      const itemStart = parse(item.start, "yyyy-MM-dd", 0);
      const itemEnd = parse(item.end, "yyyy-MM-dd", 0);
      return (
        isWithinInterval(itemStart, { start, end }) || isWithinInterval(itemEnd, { start, end })
      );
    })
  );
});

app.patch("/api/events", (req, res) => {
  /** @type {any[]} */
  const data = req.body;

  data.forEach(e => {
    const { _state, ...event } = e;
    if (_state === "new") {
      events.push(event);
    } else if (_state === "modified") {
      events.splice(
        events.findIndex(e2 => event.id === e2.id),
        1,
        event
      );
    } else if (_state === "removed") {
      events.splice(
        events.findIndex(e2 => event.id === e2.id),
        1
      );
    } else {
      console.warn(`Unknown event state '${e._state}'`);
    }
  });

  res.status(200).end();

  clearTimeout(persistEvents);
  persistEvents = setTimeout(() => {
    fs.writeFile(path.resolve(DATA_DIR, "events.json"), JSON.stringify(events, null, "\t"), err => {
      if (err) {
        console.log(err);
      }
    });
  }, 5000);
});

app.get("/api/users", (_, res) => {
  res.json(users);
});

app.get("/api/projects", (_, res) => {
  res.json(projects);
});

app.listen(PORT, () => {
  console.info(`Started app on port ${PORT}`);
});
