'use strict';

const Homey = require('homey');

const CAPABILITIES_SET_DEBOUNCE = 100;

class MyDevice extends Homey.Device {
	
	onInit() {
		this._tradfriInstanceId = this.getData().id;
		let tradfriDevice = Homey.app.getPlug(this._tradfriInstanceId);
		this.updateCapabilities(tradfriDevice);
		this.registerMultipleCapabilityListener(this.getCapabilities(), this._onMultipleCapabilityListener.bind(this), CAPABILITIES_SET_DEBOUNCE);
		this.log(`Tradfri Plug ${this.getName()} has been initialized`);
	}

	updateCapabilities(tradfriDevice) {
		if (typeof tradfriDevice != "undefined") {
			let plug = tradfriDevice.plugList[0];

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
				this.setCapabilityValue("onoff", plug.onOff)
					.catch(this.error);
			}
		}
	}

	_onMultipleCapabilityListener(valueObj, optsObj) {
		let commands = {};
		for (const [key, value] of Object.entries(valueObj)) {
            if (key === "onoff") {
				commands["onOff"] = value;
			}
		}
		return Homey.app.operatePlug(this._tradfriInstanceId, commands)
	}

}

module.exports = MyDevice;
