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
			let light = tradfriDevice.lightList[0];

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
				this.setCapabilityValue("onoff", light.onOff)
					.catch(this.error);
			}
			
			if (this.hasCapability("dim")) {
				this.setCapabilityValue("dim", light.dimmer / 100)
					.catch(this.error);
			}

			if (this.hasCapability("light_temperature")) {
				this.setCapabilityValue("light_temperature", light.colorTemperature / 100)
					.catch(this.error);
			}

			if (this.hasCapability("light_hue")) {
				this.setCapabilityValue("light_hue", light.hue / 360)
					.catch(this.error);
			}

			if (this.hasCapability("light_saturation")) {
				this.setCapabilityValue("light_saturation", light.saturation / 100)
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
			else if (key === "light_temperature") {
				commands["colorTemperature"] = value * 100;
			}
			else if (key === "light_hue") {
				commands["hue"] = value * 360;
			}
			else if (key === "light_saturation") {
				commands["saturation"] = value * 100;
			}
		}
		return Homey.app.operateLight(this._tradfriInstanceId, commands)
	}

}

module.exports = MyDevice;