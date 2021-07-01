'use strict';

const Homey = require('homey');
const node_tradfri_client = require("node-tradfri-client");

class MyDriver extends Homey.Driver {
	
	onInit() {
		this.log('Tradfri Light Driver has been initialized');
	}
	
	updateCapabilities(tradfriDevice) 
	{
		let homeyDevice = this.getDevice({id: tradfriDevice.instanceId});
		if (homeyDevice instanceof Error) return; 
		homeyDevice.updateCapabilities(tradfriDevice);
	}
	
	onPairListDevices(data, callback) {
		let devices = [];
		if (!Homey.app.isGatewayConnected()) {
			callback(new Error("First go to Settings -> Apps -> IKEA Tradfri Gateway to configure."));
		}
		else
		{
			let lights = Homey.app.getLights();
			for (const device of Object.values(lights)) {
				let light = device.lightList[0];
				let capabilities = [];
				let spectrum = light.spectrum;
				if (light.isSwitchable) {
					capabilities.push("onoff");
				}
				if (light.isDimmable) {
					capabilities.push("dim");
				}
				if (spectrum === "white" || spectrum === "rgb") {
					capabilities.push("light_temperature");
					if (spectrum === "rgb") {
						capabilities.push("light_hue");
						capabilities.push("light_saturation");
					}
				}
			
				devices.push({
					data: {
						id: device.instanceId,
					},
					capabilities: capabilities,
					name: device.name,
				});
			}	
			callback(null, devices.sort(MyDriver._compareHomeyDevice));
		}
	}

	static _compareHomeyDevice(a, b) {
		if (a.name < b.name)
			return -1;
		if (a.name > b.name)
			return 1;
		return 0;
	}
	
}

module.exports = MyDriver;