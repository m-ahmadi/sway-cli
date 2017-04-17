const DEFAULT = {
	outDir: "./release/"
};
const OUT_DIR = set("--outDir");
const OUT_HTML = "index.html";

const ASSETS = OUT_DIR+"/static";
const ROOT = "dist/";
const INPUT_HTML = ROOT+"index.html";
const toMakeDirs = ["css", "fonts", "images", "js"];

const LineByLineReader = require("line-by-line");
const copydir = require("copy-dir");
const lr = new LineByLineReader(INPUT_HTML);
const fs = require("fs");
const path = require("path");
const colors = require("colors/safe");

const link = /<link {1}/;
const script = /<script {1}/;
const img = /<img {1}/;
const href = 'href="/static/';
const src = 'src="/static/';
const dataMain = 'data-main="/static/';
// handle index.html
let html = "";
lr.on("error", err => { console.log( colors.red.bold("Something went wrong!") ); });
lr.on("line", line => {
	let isLink = link.exec(line);
	let isScript = script.exec(line);
	let isImg = img.exec(lin);
	
	let newLine;
	if (isLink) {
		newLine = line.replace(/href="/, href);
	} else if (isImg) {
		newLine = line.replace(/src="/, src);
	} else if (isScript) {
		newLine = line.replace(/src="/ , src);
		if ( /data-main="/.test(line) ) {
			newLine = newLine.replace(/data-main="/ , dataMain);
		}
	} else {
		newLine = line;
	}
	html += `${newLine}\n`
});
lr.on("end", a => {
	fs.writeFileSync(`${OUT_DIR}/${OUT_HTML}`, html);
});

// handle copying folders
mkdirIf(OUT_DIR);
mkdirIf(ASSETS);
toMakeDirs.forEach(i => {
	let p = `${ASSETS}/${i}`;
	mkdirSafe(p);
	copydir.sync(ROOT+i, p);
});

// handle edge cases
change(ASSETS+"/js/core/config.js", "ROOT.*", 'ROOT: "/static/"');
change(ASSETS+"/js/main.js", "baseUrl.*", 'baseUrl: "/static/js/",');

console.log(
	colors.yellow("Release build"), colors.green.bold("done."),
	colors.magenta.bold("\nOutput dir: "),
	colors.blue.bold(OUT_DIR)
);

function mkdirSafe(p) {
	if (p.indexOf("/") !== -1) {
		let l = p.split("/");
		let path = "";
		l.forEach(i => {
			path += `${i}/`;
			mkdirIf(path);
		});
	} else {
		mkdirIf(p);
	}
}
function mkdirIf(path) {
	if ( !fs.existsSync(path) ) {
		fs.mkdirSync(path);
	}
}
function change(filePath, ferom, to) {
	let c = fs.readFileSync(filePath, "utf-8");
	let result = c.replace(new RegExp(ferom), to);
	fs.writeFileSync(filePath, result);
}
function set(arg) {
	let args = process.argv;
	let idx = args.indexOf(arg);
	if (idx !== -1) {
		let v = args[ idx + 1 ];
		if (v) {
			return v;
		}
	}
	return DEFAULT[ arg.slice(2) ];
}