const fs = require("fs");
const path = require("path");

const { DATA_DIR = path.resolve(__dirname, "..", "data") } = process.env;

/**
 * @returns {{events: any[], users: any[], projects: any[]}}
 */
module.exports = function initData() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
  for (const key of ["events", "users", "projects"]) {
    const file = path.resolve(DATA_DIR, `${key}.json`);
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, "[]");
    }
  }

  return {
    events: require(path.resolve(DATA_DIR, "events.json")),
    users: require(path.resolve(DATA_DIR, "users.json")),
    projects: require(path.resolve(DATA_DIR, "projects.json"))
  };
};
