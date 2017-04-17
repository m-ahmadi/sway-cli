const DS = require("path").sep;
const CONF = require("./.sway/config");
const fs = require("fs-extra");
const shell = require("shelljs");
const log = console.log;

const CSS = CONF.O.CSS;
const CSS_LIBS = CONF.O.CLIB;
const STYLE = CONF.O.STYLE;
const JS_LIBS = CONF.O.JLIB;
const APP = CONF.O.APP;
const LINKS_TEMP = CONF.I.LNKT;
const SRCIPTS_TEMP = CONF.I.SRCT;

let o;
o = shell.cat(CSS_LIBS, STYLE);
fs.emptyDirSync(CSS);
fs.writeFileSync(STYLE, o, "utf8");

let toWrite = `<link rel="stylesheet" type="text/css" href="css/${CONF.F.CSS}"/>`;
fs.writeFileSync(LINKS_TEMP, toWrite, "utf8");

