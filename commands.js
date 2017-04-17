const S = require("path").sep;
const d = __dirname + S;
const n = "node " + d;
const b = n + "build" + S;
const r = " --color";

const c = {};
c["html"]        = "gulp html"+r;
c["sass"]        = "gulp sass"+r;
c["temp"]        = "gulp temp"+r;
c["js"]          = "gulp js"+r;
c["html-w"]      = "gulp html-w"+r;
c["sass-w"]      = "gulp sass-w"+r;
c["temp-w"]      = "gulp temp-w"+r;
c["js-w"]        = "gulp js-w"+r;
c["compile-all"] = "gulp all"+r;
c["livereload"]  = "gulp livereload"+r;

c["env-debug-hard"]      = b+"setenv debug-hard"+r;
c["env-debug-normal"]    = b+"setenv debug-normal"+r;
c["env-debug-light"]     = b+"setenv debug-light"+r;
c["env-release"]         = b+"setenv release-light"+r;
c["showenv"]             = b+"showenv"+r;
c["libcss"]              = b+"libs css --color"+r;
c["libjs"]               = b+"libs js --color"+r;
c["build-libs"]          = c["libcss"]              + " && " + c["libjs"];
c["build"]               = c["build-libs"]          + " && " + c["compile-all"];
c["release"]             = c["build-debug-normal"]  + " && " + b+"release"+r;
c["build-debug-hard"]    = c["env-debug-hard"]      + " && " + c["build"];
c["build-debug-normal"]  = c["env-debug-normal"]    + " && " + c["build"];
c["build-debug-light"]   = c["env-debug-light"]     + " && " + c["build"];
c["build-release-light"] = c["env-release"]         + " && " + c["build"];
c["build-release-hard"]  = c["build-release-light"] + " && " + b+"release-hard"+r;

module.exports = c;