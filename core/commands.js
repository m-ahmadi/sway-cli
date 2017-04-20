const S = require("path").sep;
const d = __dirname + S;
const n = "node " + d;
const b = n + "build" + S;
const r = " --color";

const c = {};
c["html"]    = "gulp html"+r;
c["sass"]    = "gulp sass"+r;
c["temp"]    = "gulp temp"+r;
c["js"]      = "gulp js"+r;
c["html-w"]  = "gulp html-w"+r;
c["sass-w"]  = "gulp sass-w"+r;
c["temp-w"]  = "gulp temp-w"+r;
c["js-w"]    = "gulp js-w"+r;
c["compile"] = "gulp all"+r;
c["live"]    = "gulp livereload"+r;

module.exports = c;