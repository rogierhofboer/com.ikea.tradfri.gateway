"use strict";
const platform = require("os").platform();
const execSync = require("child_process").execSync;

const COMMAND_RPI1 = "npm run install:rpi1";
const COMMAND_DEFAULT = "npm run install:default";

function getCommand() {
	if (platform === "linux") {
		// might be a RPi
		try {
			const arch = execSync("uname -m").toString();
			if (/armv6/.test(arch)) {
				console.log("running rpi1 installation script");
				return COMMAND_RPI1;
			}
		} catch (e) { /* fall back */ }
	}
	console.log("running default installation script");
	return COMMAND_DEFAULT;
}
execSync(getCommand(), {stdio: "inherit"});
process.exit(0);