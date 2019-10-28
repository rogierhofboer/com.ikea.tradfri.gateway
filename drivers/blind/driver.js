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
			callback(new Error("Please configure the gateway first."));
		}
		else
		{
			let blinds = Homey.app.getBlinds();
			for (const device of Object.values(blinds)) {
				let blind = device.blindList[0];
				let capabilities = [];
				capabilities.push("open");
				capabilities.push("close");
				capabilities.push("setPosition");
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
