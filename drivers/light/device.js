'use strict';

const Homey    = require('homey'),
      debounce = require('lodash.debounce');

const CAPABILITIES_SET_DEBOUNCE = 100;
const DIM_DEBOUNCE              = 2500;
const TEMPERATURE_DEBOUNCE      = 2500;
const HUE_DEBOUNCE              = 2500;
const SATURATION_DEBOUNCE       = 2500;

class MyDevice extends Homey.Device {
	
	onInit() {
		this._tradfriInstanceId = this.getData().id;
		let tradfriDevice = this.homey.app.getLight(this._tradfriInstanceId);
		this.updateCapabilities(tradfriDevice);
		this.registerMultipleCapabilityListener(this.getCapabilities(), this._onMultipleCapabilityListener.bind(this), CAPABILITIES_SET_DEBOUNCE);
        this._dim_debounce = debounce((capability, value) => { 
            this.setCapabilityValue(capability, value)
                .catch(this.error);
        }, DIM_DEBOUNCE, { "maxWait": DIM_DEBOUNCE });
        this._temp_debounce = debounce((capability, value) => { 
            this.setCapabilityValue(capability, value)
                .catch(this.error);
        }, TEMPERATURE_DEBOUNCE, { "maxWait": TEMPERATURE_DEBOUNCE });
        this._hue_debounce = debounce((capability, value) => { 
            this.setCapabilityValue(capability, value)
                .catch(this.error);
        }, HUE_DEBOUNCE, { "maxWait": HUE_DEBOUNCE });
        this._sat_debounce = debounce((capability, value) => { 
            this.setCapabilityValue(capability, value)
                .catch(this.error);
        }, SATURATION_DEBOUNCE, { "maxWait": SATURATION_DEBOUNCE });
        
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
                this._dim_debounce("dim", light.dimmer / 100);
			}

			if (this.hasCapability("light_temperature")) {
				this._temp_debounce("light_temperature", light.colorTemperature / 100);
			}

			if (this.hasCapability("light_hue")) {
				this._hue_debounce("light_hue", light.hue / 360);
			}

			if (this.hasCapability("light_saturation")) {
				this._sat_debounce("light_saturation", light.saturation / 100);
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
        
		return this.homey.app.operateLight(this._tradfriInstanceId, commands)
	}

}

module.exports = MyDevice;