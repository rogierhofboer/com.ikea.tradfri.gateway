'use strict';

const Homey = require('homey');
const util = require('util');

const CAPABILITIES_SET_DEBOUNCE = 100;

class MyDevice extends Homey.Device {
	
	onInit() {
		this._tradfriInstanceId = this.getData().id;
		let tradfriDevice = Homey.app.getBlind(this._tradfriInstanceId);
		this.updateCapabilities(tradfriDevice);
		//this.log('blinds this.getCapabilities()',this.getCapabilities());
		this.registerMultipleCapabilityListener(this.getCapabilities(), this._onMultipleCapabilityListener.bind(this), CAPABILITIES_SET_DEBOUNCE);
		this.log(`Tradfri Blind ${this.getName()} has been initialized`);
	}

	/*
		// Find out if it's possible to implement the following capabilities:
		"measure_battery",
		"windowcoverings_state",
		"windowcoverings_tilt_set",
		"windowcoverings_tilt_up",
		"windowcoverings_tilt_down"
	*/
	updateCapabilities(tradfriDevice) {
		if (typeof tradfriDevice != "undefined") {
			let blind = tradfriDevice.blindList[0];
			this.log(`Blind updateCapabilities: `);
			//this.log((util.inspect(tradfriDevice)));
			//this.log(`Blind item: `);
			//this.log((util.inspect(blind)));

			// check if device is available / online
			//TODO: cleanup and refactor with const
			if (!tradfriDevice.alive) {
				this.log(`tradfriDevice (temporary) unavailable`);
				this.setUnavailable("(temporary) unavailable")
					.catch (this.error);
			}
			else
			{
				this.log(`tradfriDevice.alive ${tradfriDevice.alive}`);
				this.setAvailable()
					.catch (this.error);
	
				if (this.hasCapability("windowcoverings_set")) {
					// 100 = closed
					// 0 = open
					// windowcoverings_set has a number range between 0 and 1
					//this.log(`Blind windowcoverings_set ${parseFloat(blind.position/100)}`);
					this.setCapabilityValue("windowcoverings_set", parseFloat(blind.position/100)) // find out the correct value
				}

				if (this.hasCapability("onoff")) {
					// 100 = closed
					// 0 = open
					var isBlindOpen = (blind.position < 100 ? true : false)
					this.log(`Blind onoff ${parseFloat(blind.position/100)}`);
					this.setCapabilityValue("onoff", isBlindOpen) // untested
				}

				// set battery level
				if (this.hasCapability("measure_battery")) {
					this.log(`Blind measure_battery ${parseInt(blind._accessory.deviceInfo.battery)}`);
					this.setCapabilityValue("measure_battery", parseInt(blind._accessory.deviceInfo.battery))
						.catch(this.error);

					// only set alarm if battery is below 20%
					if (this.hasCapability("alarm_battery") && (blind._accessory.deviceInfo.battery < 20)) {
						this.setCapabilityValue("alarm_battery", true)
							.catch(this.error);
					}
					// reset battery warning, battery level should be above 20%
					if(this.hasCapability("alarm_battery") && this.getCapabilityValue("alarm_battery") == true && (blind._accessory.deviceInfo.battery > 20)) {
						this.setCapabilityValue("alarm_battery", false)
						.catch(this.error);
					}
				}

			}
		}
	}

	_onMultipleCapabilityListener(valueObj, optsObj) {
		this.log(`Blind _onMultipleCapabilityListener`);
		//this.log((util.inspect(valueObj)));
		let commands = {};
		for (const [key, value] of Object.entries(valueObj)) {
			//todo: add other button interaction from the app
			//const apiMethods = ["open", "close", "setPosition"];
			if (key === "windowcoverings_set") {
				//this.log(`Blind windowcoverings_set ${parseFloat(value*100)}`);
				commands["position"] = parseFloat(value*100);
			}else if(key === "onoff"){
				// 0 = open
				// 100 = closed
				//this.log(`onoff: ${util.inspect(valueObj)}`);
				commands["position"] = (value ? 0 : 100); // percentage
			}else
			{
				this.log(`the following value is not implemented: ${util.inspect(valueObj)}`);
			}
		}
		return Homey.app.operateBlind(this._tradfriInstanceId, commands)
	}

}

module.exports = MyDevice;
