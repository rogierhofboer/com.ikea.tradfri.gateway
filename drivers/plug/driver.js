'use strict';

const Homey = require('homey');
const node_tradfri_client = require("node-tradfri-client");

class MyDriver extends Homey.Driver {
	
	onInit() {
		this.log('Tradfri Plug Driver has been initialized');
	}
	
	updateCapabilities(tradfriDevice) 
	{
		for(const device of this.getDevices()) {
			if (device.getData().id === tradfriDevice.instanceId)
				device.updateCapabilities(tradfriDevice);
		}
	}
	
	async onPairListDevices() {
		let devices = [];
		if (!this.homey.app.isGatewayConnected()) {
			throw new Error("First go to Settings -> Apps -> IKEA Tradfri Gateway to configure.");
		}
		else
		{
			let plugs = this.homey.app.getPlugs();
			for (const device of Object.values(plugs)) {
				let plug = device.plugList[0];
				let capabilities = [];
				if (plug.isSwitchable) {
				    capabilities.push("onoff");
			    }
				devices.push({
					data: {
						id: device.instanceId,
					},
					capabilities: capabilities,
					name: device.name,
				});
			}	
			return devices.sort(MyDriver._compareHomeyDevice);
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
