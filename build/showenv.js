const fs = require("fs");
const S = require("path").sep;
const c = require("colors/safe");
const v = fs.readFileSync("./.sway/"+ "env", "utf8");
console.log( c.white.bold("Current environment:"), c.black.bgWhite(` ${v} `) );