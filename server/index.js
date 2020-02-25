// @ts-check
const fs = require("fs");
const path = require("path");
const express = require("express");
const { parse, isWithinInterval } = require("date-fns");

const app = express();

app.use(express.json());

// @ts-ignore
const events = require("./events.json");
// @ts-ignore
const users = require("./users.json");
// @ts-ignore
const projects = require("./projects");

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

// app.post("/api/events", (req, res) => {
//   const event = {
//     id: Math.random()
//       .toString(36)
//       .slice(2),
//     ...req.body
//   };
//   events.push(event);
//   res.json(event);
// });

app.patch("/api/events", (req, res) => {
  /** @type {any[]} */
  const data = req.body;

  data.forEach(e => {
    const idx = events.findIndex(e2 => e.id === e2.id);
    if (idx !== -1) {
      events.splice(idx, 1, e);
    } else {
      events.push(e);
    }
  });

  fs.writeFile(path.resolve(__dirname, "events.json"), JSON.stringify(events), err => {
    res.status(200).end();
  });
});

app.get("/api/users", (_, res) => {
  res.json(users);
});

app.get("/api/projects", (_, res) => {
  res.json(projects);
});

app.listen(8080);
