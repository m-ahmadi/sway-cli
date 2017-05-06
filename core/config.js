const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const DS = path.sep;
const DL = path.delimiter;
shell.env.PATH += DL+"./node_modules/.bin";
let env  = fs.readFileSync("./.sway/"+ "env", "utf8");

const DEBUG_HARD    = "debug-hard";
const DEBUG_NORMAL  = "debug-normal";
const DEBUG_LIGHT   = "debug-light";
const RELEASE_LIGHT = "release-light";
const RELEASE_HARD  = "release-hard";
const RJS           = "node node_modules/requirejs/bin/r.js";
const RCONF         = "./rconfig.js"

const SRC  = "./src/";
const DIST = "./dist/";
const ST   = "main.handlebars";
const SD   = ".htm";
let hInd   = "    ";
const F = {
	HTML:    "index.html",
	TEMP:    "templates.js",
	CLL:     "css.list",
	JLL:     "js.list",
	SASS:    "style.scss",
	CSS:     "style",
	APP:     "app",
	LIB:     "libs",
	LINKS:   "links.htm",
	SCRIPTS: "scripts.htm"
};
if (env === DEBUG_HARD) {
	F.CSS  += ".css";
	F.APP  += ".js";
} else if (env === DEBUG_NORMAL) {
	F.CSS  += ".css";
	F.APP  += ".js";
	F.LIB  += ".min";
} else {
	F.CSS  += ".min.css";
	F.APP  += ".min.js";
	F.LIB  += ".min";
}
const I = {};
const O = {};

I.JS    = SRC    +  "js/";
I.SASS  = SRC    +  "sass/";
I.HTML  = SRC    +  "html/";
I.TEMP  = SRC    +  "template/";
I.LIB   = SRC    +  "lib/";
I.SLIBC = I.LIB  +  "";
I.SLIBJ = I.LIB  +  "";
I.STYLE = I.SASS +  F.SASS;
I.LNKT  = I.HTML +  F.LINKS;
I.SCRT  = I.HTML +  F.SCRIPTS;

O.JS    = DIST   + "js/";
O.CSS   = DIST   + "css/";
O.CLIB  = O.CSS  + "";
O.JLIB  = O.JS   + "lib/";
O.HTML  = DIST   + F.HTML;
O.STYLE = O.CSS  + F.CSS;
O.APP   = O.JS   + F.APP;
O.TEMP  = O.JS   + F.TEMP;

O.SEPLC = O.CLIB;
O.SEPLJ = O.JLIB;
O.CLIB += env !== DEBUG_HARD ? F.LIB+".css" : "";
O.JLIB += env !== DEBUG_HARD ? F.LIB+".js"  : "";


/* not gonna work if installed globally
const R = "../../../";
const L = {
	CSS: R + I.LIB + F.CLL,
	JS:  R + I.LIB + F.JLL
};
*/
// works in local and global
const R = process.cwd() + DS;
const L = {
	CSS: R + `src${DS}lib${DS+ F.CLL}`,
	JS:  R + `src${DS}lib${DS+ F.JLL}`
};



const C = {};
let sas  = `sass ${I.STYLE}:${O.STYLE}`;
let nsas = `node-sass ${I.STYLE} > ${O.STYLE}`;
C.html   = `htmlbilder ${I.HTML} -o ${O.HTML} -t ${ST} -e ${SD}`;
C.temp   = `handlebars ${I.TEMP} -f ${O.TEMP} -e hbs -m`;
C.js     = `babel ${I.JS} -d ${O.JS} -s`;

if (env === DEBUG_HARD) {
	sas  += " --style expanded --sourcemap=auto";
	nsas += " --output-style expanded --sourcemap --indent-type tab --indent-width 1";
} else if (env === DEBUG_NORMAL) {
	sas  += " --style expanded --sourcemap=auto";
	nsas += " --output-style expanded --sourcemap --indent-type tab --indent-width 1";
} else if (env === DEBUG_LIGHT) {
	sas  += " --style compressed --sourcemap=auto";
	nsas += " --output-style compressed --sourcemap";
	C.js += " --minified";
} else if (env === RELEASE_LIGHT) {
	sas  += " --style compressed --sourcemap=none";
	nsas += " --output-style compressed";
	
	let rconf = JSON.parse( fs.readFileSync(RCONF, "utf8") );
	rconf.baseUrl = I.JS;
	rconf.out = O.APP;
	rconf.optimize = "none";
	fs.writeFileSync(RCONF, JSON.stringify(rconf, null, 4), "utf8");
	
	C.js = `${RJS} -o ${RCONF} && babel ${I.JS} -o ${O.APP} -s --minified --no-comments`;
	
	O.TEMP  = I.JS + F.TEMP;
	C.temp  = `handlebars ${I.TEMP} -f ${O.TEMP} -e hbs -m`;
} else if (env === RELEASE_HARD) {
	
}

if (shell.exec("sass -v", {silent: true}).code !== 0) { // no sass
	C.sass = nsas;
} else {
	C.sass = sas;
}

C.w = {};
C.w.html = C.html + " -w";
C.w.sass = sas    + " --watch";
C.w.js   = C.js   + " -w";

C.all = `${C.html} && ${C.sass} && ${C.temp} && ${C.js}`;

module.exports = {
	DEBUG_HARD: DEBUG_HARD,
	DEBUG_NORMAL: DEBUG_NORMAL,
	DEBUG_LIGHT: DEBUG_LIGHT,
	RELEASE_LIGHT: RELEASE_LIGHT,
	RELEASE_HARD: RELEASE_HARD,
	env: env,
	I: I,
	O: O,
	L: L,
	F: F,
	C: C
};