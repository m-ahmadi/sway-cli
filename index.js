#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");
const c = require("colors/safe");
const shell = require("shelljs");
const m = require("commander");
const u = require("util-ma");

const DS = path.sep;
const log = console.log;
const d = __dirname + DS;


m.usage("command [options]");
m.version(""+ JSON.parse(fs.readFileSync(d+"package.json", "utf8")).version, "-v, --version");

m.command("init").description("Initialize project skeleton.").action( require("./core/init") );
m.command("html").description("Compile HTML.").action(run);
m.command("sass").description("Compile Sass.").action(run);
m.command("temp").description("Compile dynamic templates.").action(run);
m.command("js").description("Compile JavaScript.").action(run);
m.command("html-w").description("Watch HTML.").action(run);
m.command("sass-w").description("Watch Sass.").action(run);
m.command("temp-w").description("Watch dynamic templates.").action(run);
m.command("js-w").description("Watch JavaScript").action(run);
m.command("compile").description("Compile everything.").action(run);
m.command("livereload").description("Enable livereload for: dist/index.html, dist/css and dist/js").action(run);

const env = require("./core/env");
const liber = require("./liber");

m.command("env [name]")
	.description("Show current environment, or change it.")
	.action( env );
	
m.command("lib [which]")
	.description("Build lib based on current environment.")
	.action( which => liber(which) );

m.command("libs").description("Build all libs.").action(libs);
m.command("build [env]").description("Build libs and compile. You can specify another env.").action( env => build(env) );
m.command("release").description("Custom release.").action(release);
m.command("release-hard").description("Build and compile release-hard.").action(releaseHard);
m.command("sync").description("Sync the local Sway config with the global one.").action( require("./core/sync") );

var commands = require("./core/commands");
m.parse(process.argv);
if (!m.args.length) { m.help(); }


function run(cmd) {
	let t;
	if ( u.isObj(cmd) ) {
		t = commands[cmd._name];
	} else if ( u.isStr(cmd) ) {
		t = commands[cmd];
	} else {
		return;
	}
	
	shell.env.Path += ";./node_modules/.bin";
//	shell.env.Path += ";"+__dirname+DS+"node_modules"+DS+".bin";
	if ( shell.exec(t).code !== 0 ) {
		log( c.red.bold("Shell exec failed!") );
	}
}
function libs() {
	liber("css");
	liber("js");
}
function build(anotherEnv) {
	if (anotherEnv) {
		env(anotherEnv);
	}
	libs();
	run("compile");
}
function releaseHard() {
	build("release-light");
	require("./core/release-hard");
}
function release() {
	build("debug-normal");
	require("./core/release")();
}