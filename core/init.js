const fs = require("fs-extra");
const c = require("colors/safe");
const shell = require("shelljs");


const log = console.log;
const dir = "./.sway/";

module.exports = () => {
	log( c.magenta("Initializing project skeleton...") );
	
	if ( fs.existsSync(dir) ) {
		log("\n", c.red.bold("✖"), c.yellow("Already initialized.") );
	} else {
		fs.ensureDirSync(dir);
		fs.copySync("./node_modules/sway/skeleton/", "./", {overwrite: false});
		fs.writeFileSync("./.sway/init", "");
		require("./sync")();
		log("\n", c.green.bold("✔"), c.green("Successfuly initialized!") );
	}
};