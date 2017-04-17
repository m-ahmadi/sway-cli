#!/usr/bin/env node
const c = require("colors/safe");
const fs = require("fs-extra");
const path = require("path");
const DS = path.sep;
const shell = require("shelljs");
const y = require("yargs");
const log = console.log;
const d = __dirname + DS;
const dir = "./.sway/";
const pkg = "./package.json";

y.usage("Usage: \n $0 command");
y.version();
y.options( require("./yOpts") );
y.alias("h", "help");
y.demandCommand(1, "You must specifiy a command to run.");
y.help("h");

y.command("init", "Initialize project skeleton.", {}, init);
y.command("html", "Compile HTML.", {}, run);
y.command("sass", "Compile Sass.", {}, run);
y.command("temp", "Compile dynamic templates.", {}, run);
y.command("js", "Compile JavaScript.", {}, run);
y.command("html-w", "Watch HTML.", {}, run);
y.command("sass-w", "Watch Sass.", {}, run);
y.command("temp-w", "Watch dynamic templates.", {}, run);
y.command("js-w", "Watch JavaScript", {}, run);
y.command("compile-all", "Compile everything.", {}, run);
y.command("livereload", "Enable livereload for: dist/index.html, dist/css and dist/js", {}, run);
y.command("env-debug-hard", "Set current environment to debug-hard.", {}, run);
y.command("env-debug-normal", "Set current environment to debug-normal.", {}, run);
y.command("env-debug-light", "Set current environment to debug-light.", {}, run);
y.command("env-release", "Set current environment to release-light.", {}, run);
y.command("showenv", "Show current environment.", {}, run);
y.command("libcss", "Build CSS dependencies based on current environment.", {}, run);
y.command("libjs", "Build JS dependencies based on current environment.", {}, run);
y.command("build-libs", "Build CSS and JS dependencies based on current environment.", {}, run);
y.command("build", "Build dependencies and compile everything based on current environment.", {}, run);
y.command("release", "Custom release.", {}, run);
y.command("build-debug-hard", "Build and compile everything according to debug-hard environment.", {}, run);
y.command("build-debug-normal", "Build and compile everything according to debug-normal environment.", {}, run);
y.command("build-debug-light", "Build and compile everything according to debug-light environment.", {}, run);
y.command("build-release-light", "Build and compile everything according to release-light environment.", {}, run);
y.command("build-release-hard", "Build and compile everything according to release-hard environment.", {}, run);
y.command("sync", "Sync the local Sway config with the global one.", {}, sync);

var cmd = require("./commands");
y.argv;

function run(argv) {
	let a = argv._[0];
	shell.env.Path += ";./node_modules/.bin";
//	shell.env.Path += ";"+__dirname+DS+"node_modules"+DS+".bin";
	if ( shell.exec( cmd[a] ).code !== 0 ) {
		log( c.red.bold("Shell exec failed!") );
	}
}
function sync() {
	log( c.magenta("Syncing...") );
	let conf = require("./build/config");
	let exp = {
		F: conf.F,
		I: conf.I,
		O: conf.O,
		C: conf.C
	};
	fs.writeFileSync( "./.sway/config.json", JSON.stringify(exp, null, 4) );
	log("\t Done.", c.green.bold("✔"));
}
function init(argv) {
	log( c.magenta("Checking requirements...") );
	if ( fs.existsSync(pkg) ) {
		log( "\t The package.json file:", c.green.bold("✔") );
	} else {
		log( "\t The package.json file:", c.red.bold("✖") );
		log( c.magenta("Creating package.json file...") );
		shell.exec("npm init -f", {silent: true});
		log( "\t The package.json file:", c.green.bold("✔") );
	}
	let o = JSON.parse( fs.readFileSync(pkg, "utf8") );
	if (o.devDependencies && o.devDependencies.sway &&
		fs.existsSync("./node_modules/sway/") ) {
		log( "\t Local dependencies:", c.green.bold("✔") );
	} else {
		log( "\t Local dependencies:", c.red.bold("✖") );
		log( c.magenta("Installing local dependencies... (this might take a while)") );
		shell.exec("npm install m-ahmadi/sway --save-dev");
		log( "\t Local dependencies:", c.green.bold("✔") );
	}
	log( c.magenta("Initializing project skeleton...\n") );
	
	if ( fs.existsSync(dir) ) {
		log(c.red.bold("✖"), c.yellow("Already initialized.") );
	} else {
		fs.ensureDirSync(dir);
		fs.copySync(d+ "skeleton/", "./", {overwrite: false});
		fs.writeFileSync("./.sway/init");
		sync();
		log(c.green.bold("✔"), c.green("Successfuly initialized!") );
	}
	
}