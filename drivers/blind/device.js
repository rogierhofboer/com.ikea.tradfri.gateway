'use strict';

const Homey = require('homey');

const CAPABILITIES_SET_DEBOUNCE = 100;

class MyDevice extends Homey.Device {
	
	onInit() {
		this._tradfriInstanceId = this.getData().id;
		let tradfriDevice = Homey.app.getBlind(this._tradfriInstanceId);
		this.updateCapabilities(tradfriDevice);
		this.registerMultipleCapabilityListener(this.getCapabilities(), this._onMultipleCapabilityListener.bind(this), CAPABILITIES_SET_DEBOUNCE);
		this.log(`Tradfri Blind ${this.getName()} has been initialized`);
	}

	updateCapabilities(tradfriDevice) {
		if (typeof tradfriDevice != "undefined") {
			let blind = tradfriDevice.blindList[0];

			if (tradfriDevice.alive) {
				this.setAvailable()
					.catch (this.error);
			}
			else
			{
				this.setUnavailable("(temporary) unavailable")
					.catch (this.error);
			}
			
			if (this.hasCapability("onoff")) {
				this.setCapabilityValue("onoff", blind.onOff)
					.catch(this.error);
			}

			if (this.hasCapability("windowcoverings_set")) {
				this.setCapabilityValue("windowcoverings_set", blind.setPosition)
					.catch(this.error);
			}


		
		}
	}

	_onMultipleCapabilityListener(valueObj, optsObj) {
		let commands = {};
		for (const [key, value] of Object.entries(valueObj)) {

			if (key === "onoff") {
				commands["onoff"] = value;
			}
			else if (key === "windowcoverings_set") {
				commands["setPosition"] = value;
			}
		}
		return Homey.app.operateBlind(this._tradfriInstanceId, commands)
	}

}

module.exports = MyDevice;
