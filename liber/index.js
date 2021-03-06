const path = require("path");
const c = require("colors/safe");
const fs = require("fs-extra");
const u = require("util-ma");
const shell = require("shelljs");
const DS = path.sep;
const DL = path.delimiter;
const log = console.log;
shell.env.PATH += DL+"./node_modules/.bin";

let CONF;
let w, W, js, css;

let iDir, oDir, list, last, temp, app, sepLib,
	listPath,
	rqName, rqSrc, rqDest;

function setConfig() {
	if (css) {
		iDir = CONF.I.SLIBC;
		oDir = CONF.O.CLIB;
		list = CONF.L.CSS;
		temp = CONF.I.LNKT;
		app = CONF.F.CSS;
		sepLib = CONF.O.SEPLC;
	} else if (js) {
		iDir = CONF.I.SLIBJ;
		oDir = CONF.O.JLIB;
		list = CONF.L.JS;
		temp = CONF.I.SCRT;
		app = CONF.F.APP;
		sepLib = CONF.O.SEPLJ;
	}
}
function debugHard() {
	if ( u.isArr(last) ) {
		list = list.concat( list.pop() );
	}
	
	let toWrite = "";
	log( c.yellow("Copying...") );
	clearDir();
	
	toWrite = forEachLib(list, true);
	toWrite += css ? html(`style.css`) : appHtml("main");
	
	copyRq();
	
	fs.writeFileSync(temp, toWrite, "utf8");
	log( "\t File:", c.green(temp), "created." );
	log( c.green("Done.") );
}
function common(srcmap, unminApp) {
	let separates = u.isArr(last) ? list.pop() : undefined;
	
	log( c.yellow("Libs...") );
	let toCat = forEachLib(list, false);
	
	clearDir();
	
	let outFile = oDir;
	let catenated = shell.cat(toCat);
	fs.writeFileSync(outFile, catenated, "utf-8");
	log( c.yellow("Minifying...") );
	
	let command;
	if (css) {
		command = `csso ${outFile} -o ${outFile}`;
		command += srcmap ? ` -m ${outFile}.map` : "";
	} else if (js) {
		command = `uglifyjs ${outFile} -o ${outFile}`;
		command += srcmap ? ` --source-map ${outFile}.map` : "";
	}
	
	if (shell.exec(command).code !== 0) {
		shell.echo( c.red.bold("\t Minifying failed.") );
		shell.exit(1);
	}
	log("\t File:", c.cyan(outFile), "created. \n");
	
	let toWrite = "";
	
	toWrite += html(`${CONF.F.LIB}.${w}`) + "\n";
	toWrite += css ? `<link rel="styleSheet" type="text/css" href="css/${app}" />` : "";
	if (separates) {
		log( c.yellow("Separate lib(s)...") );
		toWrite += forEachLib(separates, true, true);
	}
	
	if (srcmap) {
		log( "\t File:", c.cyan(`${outFile}.map`), "created." );
		toWrite += js ? appHtml("main") : "";
	} else {
		toWrite += js && !unminApp ? appHtml(app) : js && unminApp ? appHtml("main") : "";
	}
	
	copyRq();
	
	fs.writeFileSync(temp, toWrite, "utf8");
	log( "\t File:", c.cyan(temp), "created." );
	log( c.green("Done.") );
}
function forEachLib(list, sw, sep) {
	let toRet = sw ? "" : [];
	let occurred = false;
	list.forEach(i => {
		let file = i + "." + w;
		let fileBasename = path.basename(file);
		let src  = iDir + file;
		let dest = sep ? sepLib : oDir;
		dest += fileBasename;
		if ( fs.existsSync(src) ) {
			sw ? fs.copySync(src, dest) : toRet.push(src);
			sw ? toRet += html(fileBasename) + "\n" : undefined;
		} else {
			occurred = true;
			let err = c.red.bold("\t Couldn't find: ") + c.white.bold.bgRed(` ${file} `);
			src = iDir + i + ".min." + w;
			if ( fs.existsSync(src) ) {
				err += c.green.bold("  Found: ") + c.magenta(file+".min");
				sw ? fs.copySync(src, dest) : toRet.push(src);
				sw ? toRet += html(fileBasename) + "\n" : undefined;
			} else {
				err += c.red.bold(" or ") + c.white.bold.bgRed(` ${file} `);
			}
			msg(1, err);
		}
	});
	if (occurred) { msg(2); }
	return toRet;
}
function html(v) {
	if (css) {
		return `<link rel="stylesheet" type="text/css" href="css/${v}" />`;
	} else if (js) {
		return `<script type="text/javascript" src="js/lib/${v}"></script>`;
	}
}
function appHtml(v) {
	return `<script data-main="js/${v}" src="js/lib/${rqName}"></script>`;
}
function checkRq() {
	let name = "requirejs/require";
	let pth = CONF.I.SLIBJ + name;
	let min = ".min.js";
	let unmin = ".js";
	if ( fs.existsSync(pth + min) ) {
		pth += min;
		name += min;
		
	} else if ( fs.existsSync(pth + unmin) ) {
		pth += unmin;
		name += unmin;
	} else {
		log( c.red.bold("The RequireJS library is necessary, and it's not found.") );
	}
	name = path.basename(name);
	rqName = name;
	rqSrc = pth;
	rqDest = CONF.O.SEPLJ + name;
}
function copyRq() {
	if ( rqDest.endsWith("require.js") ) {
		const file = CONF.O.SEPLJ + rqName;
		fs.ensureFileSync(file);
		if (shell.exec(`uglifyjs ${rqSrc} -o ${file}`).code !== 0) {
			shell.echo( c.red.bold("\t Minifying requirejs failed.") );
			shell.exit(1);
		}
	} else {
		fs.copySync(rqSrc, rqDest);
	}
}
function msg(w, a, b) {
	switch (w) {
	case 1:
		log(a); break;
	case 2:
		log( c.white("\t (Make sure the list in:"), c.blue.bold(listPath), "is correct.)\n" ); break;
	}
}
function parseList(filePath) {
	let o = [];
	let s = [];
	let t = fs.readFileSync(filePath, "utf8").split("\n");
	t.forEach((i, x) => {
		if ( /\S/.test(i) && !i.startsWith("//") ) {
			if ( i.startsWith("@") ) {
				s.push( i.slice(1).trim() );
			} else {
				o.push( i.trim() );
			}
		}
	});
	o.push(s);
	return o;
}
function clearDir() {
	let dir;
	if (css) {
		dir = oDir;
		if ( fs.existsSync(dir) ) {
			if ( fs.lstatSync(dir).isDirectory() ) {
				fs.emptyDirSync(dir);
			}
		}
	} else if (js) {
		dir = CONF.O[W] + "lib";
		fs.emptyDirSync(dir);
	}
}
function start(which) {
	if (!which) {
		log( c.red.bold("✖"), c.magenta.bold("Must specify which deps to build.") );
		return;
	} else if (which !== "css" && which !== "js") {
		log( c.red.bold("✖"), c.magenta.bold("Unkown option:"), c.yellow(which), "\n [css|js]" );
		return;
	}
	CONF = require("../core/config");
	
	w = which || "css";
	W = w.toUpperCase();
	js = w === "js";
	css = w === "css";
	listPath = CONF.L[W].slice(3);
	
	setConfig();
	list = parseList(list),
	last = list[ list.length - 1 ];

	log(c.white.bold("Building", c.white.bold.bgBlue(` ${W} `), "libs for environment:"), c.black.bgWhite(` ${CONF.env} \n`));
	fs.emptyDirSync( CONF.O[ W ] );
	checkRq();

	if (CONF.env === CONF.DEBUG_HARD) {
		debugHard();
		
	} else if (CONF.env === CONF.DEBUG_NORMAL) {
		common(true, true);
	} else if (CONF.env === CONF.DEBUG_LIGHT) {
		common(true);
	} else if (CONF.env === CONF.RELEASE_LIGHT) {
		common(false);
	} else if (CONF.env === CONF.RELEASE_HARD) {
		
	}
}
module.exports = start;