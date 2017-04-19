const fs = require("fs-extra");
const c = require("colors/safe");

function init() {
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
module.exports = init;