'use strict';

const Homey = require('homey');
const node_tradfri_client = require("node-tradfri-client");

const lightDriverName = "light";

class IkeaTradfriGatewayApp extends Homey.App {
    
    onInit() {
        this._gatewayConnected = false;
        this._homeyLightDriver = Homey.ManagerDrivers.getDriver(lightDriverName);
        this._lights = {};
        (async (args, callback) => {
            try {
                await this.connect();
            } catch (err) {
                this.log(err.message);
            }
        })();
        this.log(`Tradfri Gateway App has been initialized`);
    }

    async discover() {
            return node_tradfri_client.discoverGateway();
    }

    async authenticate(name, securityCode) {
        let client = new node_tradfri_client.TradfriClient(name);
        return client.authenticate(securityCode);
    }

    async connect()
    {
        this._gatewayConnected = false;
        if (this._tradfri != null) {
            this._tradfri.destroy();
        }
        this._tradfri = new node_tradfri_client.TradfriClient(Homey.ManagerSettings.get('name'), {
            watchConnection: {
                pingInterval: 10000,
                failedPingCountUntilOffline: 1,
                failedPingBackoffFactor: 1.5,
                reconnectionEnabled: true,
                offlinePingCountUntilReconnect: 3,
                // maximumReconnects: 3, // default is infinite
                connectionInterval: 10000,
                maximumConnectionAttempts: 1, //default is infinite
                failedConnectionBackoffFactor: 1.5
            }
        });
        this._tradfri
            //.on("ping failed", (count) => this.log(`${count} pings failed`))
            //.on("ping succeeded", () => this.log("ping succeeded"))
            .on("connection lost", () => this.log("connection lost"))
            .on("connection failed", (att, max) => this.log(`connection failed: attempt ${att} of ${max}`))
            .on("connection alive", () => this.log("connection alive"))
            .on("gateway offline", () => this.log("gateway offline"))
            .on("reconnecting", (att, max) => this.log(`reconnect attempt ${att} of ${max}`))
            .on("give up", () => this.log("giving up..."))
            .on("device updated", this._deviceUpdated.bind(this))
            .on("device removed", this._deviceRemoved.bind(this));
        await this._tradfri.connect(Homey.ManagerSettings.get('identity'), Homey.ManagerSettings.get('psk'));
        this._gatewayConnected = true;
        this._tradfri.observeDevices();
    }

    isGatewayConnected() {
        return this._gatewayConnected;
    }

    getLight(tradfriInstanceId) {
        return this._lights[tradfriInstanceId];
    }

    getLights() {
        return this._lights;
    }

    operateLight(tradfriInstanceId, commands) {
        let acc = this._lights[tradfriInstanceId];
        if (typeof acc != "undefined") {
            this._tradfri.operateLight(acc, commands);
            return Promise.resolve();
        }
        return Promise.reject("light not found");
    }

    _deviceUpdated(acc) {
        if (acc.type === node_tradfri_client.AccessoryTypes.lightbulb) {
            this.log(`${acc.name} updated`);
            this._lights[acc.instanceId] = acc;
            this._homeyLightDriver.updateCapabilities(acc);
        }
    }

    _deviceRemoved(acc) {
        this.log(`${acc.name} removed`);
        if (acc.type === node_tradfri_client.AccessoryTypes.lightbulb) {
            delete this._lights[acc.instanceId];
        }
    }
}
module.exports = IkeaTradfriGatewayApp;
