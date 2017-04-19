const c = require("colors");
const fs = require("fs");
const log = console.log;
const envsList = require("./envs-list");

const succ = c.green.bold("✔");
const fail = c.red.bold("✖");
const main = c.magenta.bold;
const bg = c.black.bgWhite
module.exports = function (envName) {
	let p = "./.sway/env";
	if (envName) {
		if ( envsList.indexOf(envName) !== -1 ) {
			fs.writeFileSync(p, envName);
			log( succ, main("Switched to:"), bg(` ${envName} `), main("environment.") );
		} else {
			log( fail, main("Unknown environment:"), c.yellow(envName), `\n [${envsList.join("|")}]`  );
		}
	} else {
		const v = fs.readFileSync(p, "utf8");
		log( main("Current environment:"), bg(` ${v} `) );
	}
};