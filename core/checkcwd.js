const path = require("path");
const c = require("colors/safe");
const fs = require("fs-extra");
const shell =require("shelljs");
const log = console.log;

const mag = c.magenta;
const yel = c.yellow;
const cyn = c.cyan;
const grn = c.green;

const succ = c.green.bold("✔");
const fail = c.red.bold("✖");
const pkg = "./package.json";
const cwd = process.cwd();
const m1 = "\t package.json: ";
const m2 = "\t local dependencies: ";
const mi = "\t project initialized: ";
const m3 = mag("Current working directory changed to:");
const m4 = mag("Creating package.json...");
const m5 = mag("Installing local dependencies... (This might take a while)");
const m6 = "package.json";
const m7 = "local dependencies";
const mii = "project initialized";
const m8 = mag.bold(" Unsatisfied requirement: ");
const q1 = cyn.bold("Do you want to create a package.json? (y/n) \n");
const q2 = cyn.bold("Do you want to install local dependencies? (y/n) \n");
const q3 = cyn.bold("Do you want to initialize? (y/n) \n");

const i1 = c.magenta("Initializing project skeleton...");
const i2 = "\n "+ fail +yel(" Already initialized.");
const i3 = "\n "+ succ +grn(" Successfuly initialized!");

// const readline = require("readline");
const readlineSync = require("readline-sync");
let rl;
let say;
let changed = false;
let finalResult = false;

const dir = "./.sway/";
const ignores = [
	"node_modules/",
	".sass-cache/*",
	"release/*",
	"dist/css/*",
	"dist/js/*",
	"dist/index.html",
];
function init() {
	if ( !isInit() ) {
		say ? log(i1) : undefined;
		fs.ensureDirSync(dir);
		fs.copySync("./node_modules/sway/skeleton/", "./", {overwrite: false});
		fs.writeFileSync("./.sway/init");
		fs.writeFileSync("./.gitignore", ignores.join("\n"), "utf8");
		require("./sync")();
		return true;
	} else {
		return false;
	}
}
function isInit() {
	return fs.existsSync("./.sway") && fs.existsSync("./.sway/init");
}
function createPkg() {
	log( m4 );
	shell.exec("npm init -f", {silent: true});
}
function install() {
	log( m5 );
	shell.exec("npm install m-ahmadi/sway --save-dev");
}
function isSway() {
	if ( fs.existsSync("./node_modules") ) {
		let r = fs.readdirSync("./node_modules/");
		if (fs.existsSync("./node_modules/sway") &&
			r.length &&
			r.length >= 18) {
			return true;
		}
	}
	return false;
}	
function initNoQ() {
	log( m1+fail );
	log( m2+fail );
	log( mi+fail );
	createPkg();
	log( m1+succ );
	log( m2+fail );
	log( mi+fail );
	install();
	log( m1+succ );
	log( m2+succ );
	log( mi+fail );
	init()
	log( m1+succ );
	log( m2+succ );
	log( mi+succ );
	log(i3);
}
function ques3() {
	let ans = readlineSync.question(q3);
	if (ans.toLowerCase() === "y") {
		init();
		return true;
	} else {
		log( fail+m8+mii );
	}
	return false;
}
function ques2() {
	let ans = readlineSync.question(q2);
	if (ans.toLowerCase() === "y") {
		install();
		return true;
	} else {
		log( fail+m8+m7 );
		log( fail+m8+mii );
	}
	return false;
}
function ques1() {
	let ans = readlineSync.question(q1);
	if (ans.toLowerCase() === "y") {
		createPkg();
		return true;
	} else {
		log( fail+m8+m6 );
		log( fail+m8+m7 );
		log( fail+m8+mii );
	}
	return false;
}
function check() {
	if ( fs.existsSync(pkg) ) {
		if ( isSway() ) {
			if ( isInit() ) {
				return 3;
			}
			return 2;
		}
		return 1;
	}
	return 0;
}
function act(code, noQes) {
	if (code === 1 || code === 2) {
		changed ? log( mag(m3), cyn( process.cwd() ) ) : undefined;
	}
	if (code === 3) {
		say ? log( m1+succ ) : undefined;
		say ? log( m2+succ ) : undefined;
		say ? log( mi+succ ) : undefined;
		say ? log(i2) : undefined;
		return true;
	} else if (code === 2) {
		say ? log( m1+succ ) : undefined;
		say ? log( m2+succ ) : undefined;
		log( mi+fail );
		ques3();
	} else if (code === 1) {
		say ? log( m1+succ ) : undefined;
		log( m2+fail );
		log( mi+fail );
		if ( ques2() ) {
			log( mi+fail );
			ques3() ? log(i3) : log(i2);
		}
	} else if (code === 0) {
		process.chdir(cwd);
		log( m1+fail );
		log( m2+fail );
		log( mi+fail );
		if ( ques1() ) {
			log( m2+fail );
			log( mi+fail );
			if ( ques2() ) {
				log( mi+fail );
				ques3() ? log(i3) : log(i2);
			}
		}
	}
}
function look(noLookup) {
	let r = check();
	let res = false;
	if (r === 3) {
		res = act(r);
	} else if (r === 2) {
		res = act(r);
	} else if (r === 1) {
		res = act(r);
	} else if (r === 0) {
		if (noLookup) {
			res = initNoQ();
		}
		process.chdir("../");
		changed = true;
		if ( !path.basename( process.cwd() ) ) { // root
			res = act( check() );
		} else {
			look();
		}
	}
	return res;
}
module.exports = function (verbose) {
	debugger
	say = verbose;
	say ? log( mag("Checking requirements...") ) : undefined;
	let r = look(verbose);
	return r;
};