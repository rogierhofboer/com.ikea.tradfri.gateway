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

			// todo: create custom driver capacity
			// https://apps.developer.athom.com/tutorial-Drivers-Capabilities.html

			if (this.hasCapability("open")) {
				this.setCapabilityValue("open", blind.open)
					.catch(this.error);
			}

			if (this.hasCapability("close")) {
				this.setCapabilityValue("close", blind.close)
					.catch(this.error);
			}

			if (this.hasCapability("setPosition")) {
				this.setCapabilityValue("setPosition", blind.setPosition / 100)
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

			if (key === "open") {
				commands["open"] = value;
			}
			else if (key === "close") {
				commands["close"] = value;
			}
			else if (key === "setPosition") {
				commands["setPosition"] = value * 100;
			}
		}
		return Homey.app.operateBlind(this._tradfriInstanceId, commands)
	}

}

module.exports = MyDevice;
