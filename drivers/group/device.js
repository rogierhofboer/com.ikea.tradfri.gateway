'use strict';

const Homey = require('homey');

const CAPABILITIES_SET_DEBOUNCE = 100;

class MyDevice extends Homey.Device {
	
	onInit() {
		this._tradfriInstanceId = this.getData().id;
		let tradfriDevice = Homey.app.getLight(this._tradfriInstanceId);
		this.updateCapabilities(tradfriDevice);
		this.registerMultipleCapabilityListener(this.getCapabilities(), this._onMultipleCapabilityListener.bind(this), CAPABILITIES_SET_DEBOUNCE);

        this.log(`Tradfri Light ${this.getName()} has been initialized`);
	}

	updateCapabilities(tradfriDevice) {
		if (typeof tradfriDevice != "undefined") {
			let group = tradfriDevice;
			
			if (this.hasCapability("onoff")) {
				this.setCapabilityValue("onoff", group.onOff)
					.catch(this.error);
			}
			
			if (this.hasCapability("dim")) {
				this.setCapabilityValue("dim", group.dimmer / 100)
					.catch(this.error);
			}
		}
	}

	_onMultipleCapabilityListener(valueObj, optsObj) {
		let commands = {};
		for (const [key, value] of Object.entries(valueObj)) {
			if (key === "dim") {
				commands["dimmer"] = value * 100;
			}
			else if (key === "onoff") {
				commands["onOff"] = value;
			}
		}

		if(!Number.isNaN(commands["dimmer"]))
            commands["onOff"] = commands["dimmer"] > 0;

		return Homey.app.operateGroup(this._tradfriInstanceId, commands)
	}
}

module.exports = MyDevice;