'use strict';

const 	Homey 				= require('homey'),
		debounce 			= require('lodash.debounce');

const CAPABILITIES_SET_DEBOUNCE = 200;

class MyDevice extends Homey.Device {
	
	onInit() {
		this._tradfriInstanceId = this.getData().id;
		this._dimSetByCode = false;
        this._resetSetByCodeDebounce = debounce(() => { this._dimSetByCode = false; }, 1000);
		this._calculateDimDebounce = debounce(this._calculateDim.bind(this), 300);


		this.registerMultipleCapabilityListener(this.getCapabilities(), this._onMultipleCapabilityListener.bind(this), CAPABILITIES_SET_DEBOUNCE);

        this.log(`Tradfri Light ${this.getName()} has been initialized`);
	}

	updateCapabilities(tradfriDevice) {
		//Ignore this, as ikea gateway does not send correct values when turning off and we are covered through other code
        /*
		if (typeof tradfriDevice !== "undefined") {
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
		*/
	}

    deviceInGroupUpdated() {
		this._calculateDimDebounce();
	}

	_calculateDim() {
        if(this._dimSetByCode || !this.hasCapability("dim"))
        	return;

        let dimValues = [];
        const group = Homey.app.getGroup(this._tradfriInstanceId);
        group.deviceIDs.forEach(deviceId => {
            const light = Homey.app.getLight(deviceId);
            if(light && light.lightList)
			{
				const device = light.lightList[0];
				if(device.dimmer)
                	dimValues.push(device.onOff ? device.dimmer : 0);
			}
        });

        if(dimValues.length > 0)
		{
			let avgDim = dimValues.reduce((t, n) => t + n) / dimValues.length;
			if(avgDim !== this.getCapabilityValue("dim"))
			{
                this.log('Adjusting dim value based on avg by devices:', avgDim);
				this.setCapabilityValue("dim", avgDim / 100).catch(this.error);
            }

            if(avgDim > 0 !== this.getCapabilityValue("onoff"))
            {
                this.log('Setting onoff to:', avgDim > 0);
                this.setCapabilityValue("onoff", avgDim > 0).catch(this.error);
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

        if (commands["dimmer"] !== undefined) {
            if (commands["dimmer"] === 0)
                commands["onOff"] = false;
            else if (commands["dimmer"] > 0 && this.getCapabilityValue("onoff") === false)
                this.setCapabilityValue("onoff", true);

            if (this.getSetting('force_individual_dim')) {
                this.log('Updating dim individually to', commands["dimmer"]);
                const group = Homey.app.getGroup(this._tradfriInstanceId);
                if (group && group.deviceIDs) {
                    group.deviceIDs.forEach(deviceId => {
                        if (Homey.app.getLight(deviceId))
                            Homey.app.operateLight(deviceId, commands)
                    });
                    return Promise.resolve();
                }
            }
        }

        this._dimSetByCode = true;
        this._resetSetByCodeDebounce();

		return Homey.app.operateGroup(this._tradfriInstanceId, commands)
	}
}

module.exports = MyDevice;