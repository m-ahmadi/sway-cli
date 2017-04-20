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

const commands = require("./core/commands");
const init = require("./core/init");
const env = require("./core/env");
const sync = require("./core/sync");
const liber = require("./liber");
const checkCwd = require("./core/checkcwd");

m.usage("command [options]");
m.version(""+ JSON.parse(fs.readFileSync(d+"package.json", "utf8")).version, "-v, --version");

m.command("check")
	.description("Initialize project skeleton.")
	.option("-s, --say", "some options")
	.action( require("./core/checkcwd") );

m.command("init").description("Initialize project skeleton.").action( ()=>checkCwd(true) );
m.command("html").description("Compile HTML.").action(run);
m.command("sass").description("Compile Sass.").action(run);
m.command("temp").description("Compile dynamic templates.").action(run);
m.command("js").description("Compile JavaScript.").action(run);
m.command("html-w").description("Watch HTML.").action(run);
m.command("sass-w").description("Watch Sass.").action(run);
m.command("temp-w").description("Watch dynamic templates.").action(run);
m.command("js-w").description("Watch JavaScript").action(run);
m.command("compile").description("Compile everything.").action(run);
m.command("live").description("Enable livereload for: dist/index.html, dist/css and dist/js").action(run);
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
m.command("sync").description("Sync the local Sway config with the global one.").action(sync);
m.parse(process.argv);
m.args.length || m.help();


function run(cmd) {
	if (!checkCwd()) return;
	
	let t = u.isObj(cmd) ? commands[cmd._name] : u.isStr(cmd) ? commands[cmd] : undefined;
	if (!t) return;
	shell.env.Path += ";./node_modules/.bin";
//	shell.env.Path += ";"+__dirname+DS+"node_modules"+DS+".bin";
	shell.exec(t).code !== 0 ?
		log( c.red.bold("Shell exec failed!") ) : undefined;
}
function libs() {
	if (!checkCwd()) return;
	
	liber("css");
	liber("js");
}
function build(anotherEnv) {
	if (!checkCwd()) return;
	
	if (anotherEnv) {
		env(anotherEnv);
	}
	libs();
	sync();
	run("compile");
}
function releaseHard() {
	if (!checkCwd()) return;
	
	build("release-light");
	require("./core/release-hard");
}
function release() {
	if (!checkCwd()) return;
	
	build("debug-normal");
	require("./core/release")();
}