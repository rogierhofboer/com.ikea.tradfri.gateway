'use strict';

const Homey = require('homey');

class MyDriver extends Homey.Driver {
	
	onInit() {
		this.log('Tradfri Group Driver has been initialized');
	}
	
	updateCapabilities(tradfriGroup)
	{
		for(const device of this.getDevices()) {
			if (device.getData().id === tradfriGroup.instanceId)
				device.updateCapabilities(tradfriGroup);
		}
	}

    deviceInGroupUpdated(tradfriGroup) {
		for(const device of this.getDevices()) {
			if (device.getData().id === tradfriGroup.instanceId)
				device.deviceInGroupUpdated(tradfriGroup);
		}
	}
	
	async onPairListDevices() {
		let devices = [];
		if (!this.homey.app.isGatewayConnected()) {
			throw new Error("First go to Settings -> Apps -> IKEA Tradfri Gateway to configure.");
		}
		else
		{
			let groups = this.homey.app.getGroups();
			for (const group of Object.values(groups)) {
				let capabilities = [];
					capabilities.push("onoff");
					capabilities.push("dim");

				devices.push({
					data: {
						id: group.instanceId,
					},
					capabilities: capabilities,
					name: group.name,
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