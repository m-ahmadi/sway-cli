const c = require("colors/safe");
const fs = require("fs");

module.exports = () => {
	log( c.magenta("Syncing...") );
	let conf = require("./config");
	let exp = {
		F: conf.F,
		I: conf.I,
		O: conf.O,
		C: conf.C
	};
	fs.writeFileSync( "./.sway/config.json", JSON.stringify(exp, null, 4) );
	log("\t Done.", c.green.bold("✔"));
};