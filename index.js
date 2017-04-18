#!/usr/bin/env node
const c = require("colors/safe");
const fs = require("fs-extra");
const path = require("path");
const DS = path.sep;
const shell = require("shelljs");
const m = require("commander");
const log = console.log;
const d = __dirname + DS;
const dir = "./.sway/";
const pkg = "./package.json";

m.usage("Usage: \n $0 command");
m.version(""+ JSON.parse(fs.readFileSync(d+"package.json", "utf8")).version, "-v, --version");

m.command("init").description("Initialize project skeleton.".action(init);
m.command("html").description("Compile HTML.".action(run);
m.command("sass").description("Compile Sass.".action(run);
m.command("temp").description("Compile dynamic templates.".action(run);
m.command("js").description("Compile JavaScript.".action(run);
m.command("html-w").description("Watch HTML.".action(run);
m.command("sass-w").description("Watch Sass.".action(run);
m.command("temp-w").description("Watch dynamic templates.".action(run);
m.command("js-w").description("Watch JavaScript".action(run);
m.command("compile-all").description("Compile everything.".action(run);
m.command("livereload").description("Enable livereload for: dist/index.html, dist/css and dist/js".action(run);
m.command("env-debug-hard").description("Set current environment to debug-hard.".action(run);
m.command("env-debug-normal").description("Set current environment to debug-normal.".action(run);
m.command("env-debug-light").description("Set current environment to debug-light.".action(run);
m.command("env-release").description("Set current environment to release-light.".action(run);
m.command("showenv").description("Show current environment.".action(run);
m.command("libcss").description("Build CSS dependencies based on current environment.".action(run);
m.command("libjs").description("Build JS dependencies based on current environment.".action(run);
m.command("build-libs").description("Build CSS and JS dependencies based on current environment.".action(run);
m.command("build").description("Build dependencies and compile everything based on current environment.".action(run);
m.command("release").description("Custom release.".action(run);
m.command("build-debug-hard").description("Build and compile everything according to debug-hard environment.".action(run);
m.command("build-debug-normal").description("Build and compile everything according to debug-normal environment.".action(run);
m.command("build-debug-light").description("Build and compile everything according to debug-light environment.".action(run);
m.command("build-release-light").description("Build and compile everything according to release-light environment.".action(run);
m.command("build-release-hard").description("Build and compile everything according to release-hard environment.".action(run);
m.command("sync").description("Sync the local Sway config with the global one.".action(sync);

var cmd = require("./commands");
m.parse(process.argv);
if (!m.args.length) { m.help(); }

function run(command) {
	let a = command._name;
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
	log( c.magenta("Initializing project skeleton...") );
	
	if ( fs.existsSync(dir) ) {
		log("\n", c.red.bold("✖"), c.yellow("Already initialized.") );
	} else {
		fs.ensureDirSync(dir);
		fs.copySync("./node_modules/sway/skeleton/", "./", {overwrite: false});
		fs.writeFileSync("./.sway/init");
		sync();
		log("\n", c.green.bold("✔"), c.green("Successfuly initialized!") );
	}
	
}