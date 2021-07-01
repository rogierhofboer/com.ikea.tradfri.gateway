'use strict';

const Homey = require('homey');
const node_tradfri_client = require("node-tradfri-client");

class MyDriver extends Homey.Driver {
	
	onInit() {
		this.log('Tradfri Plug Driver has been initialized');
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
			let blinds = Homey.app.getBlinds();
			for (const device of Object.values(blinds)) {
				let capabilities = [];
				//Todo: Fetch capabilities from the app.json file
				capabilities.push("onoff");
				capabilities.push("windowcoverings_set");
				capabilities.push("measure_battery");
				capabilities.push("alarm_battery");
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
