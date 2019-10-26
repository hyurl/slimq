/* global mqtt, bsp, window */
"use strict";

class SimpleMQ {
    /**
     * @param {{[x: string]: any, scope?: string}} config 
     */
    constructor(config) {
        this.config = config;
        this.topics = Object.create(null);
    }

    /**
     * @returns {Promise<this>}
     */
    connect() {
        return new Promise((resolve, reject) => {
            if (typeof mqtt === "undefined") {
                global["mqtt"] = require("mqtt");
            }

            if (typeof bsp === "undefined") {
                global["bsp"] = require("bsp");
            }

            this.channel = mqtt.connect(this.config);
            this.channel.on("connect", () => {
                this.channel.on("message", (topic, payload, packet) => {
                    let handlers = this.topics[topic];

                    if (handlers && handlers.size > 0) {
                        let data;

                        try {
                            data = bsp.decode(payload);
                        } catch (e) {
                            data = payload;
                        }

                        for (let handler of handlers.values()) {
                            handler.call(void 0, data, packet);
                        }
                    }
                });

                resolve(this);
            }).on("error", (err) => {
                reject(err);
            });
        });
    }

    /**
     * @returns {Promise<this>}
     */
    disconnect() {
        return new Promise(resolve => {
            this.channel.end(true, null, () => resolve(this));
        });
    }

    /**
     * @param {string} topic 
     * @param {any} data 
     */
    publish(topic, data) {
        topic = this.resolve(topic);
        this.channel.publish(topic, bsp.encode(data));
        return this;
    }

    /**
     * @param {string} topic 
     * @param {(data: any) => void} handler 
     */
    subscribe(topic, handler) {
        topic = this.resolve(topic);
        this.channel.subscribe(topic);

        if (!this.topics[topic]) {
            this.topics[topic] = new Set([handler]);
        } else {
            this.topics[topic].add(handler);
        }

        return this;
    }

    /**
     * @param {string} topic 
     * @param {(data: any) => void} handler 
     */
    unsubscribe(topic, handler) {
        topic = this.resolve(topic);

        if (handler) {
            let handlers = this.topics[topic];
            if (handlers && handlers.size > 0) {
                handlers.delete(handler);
            }
        } else {
            this.channel.unsubscribe(topic);
            delete this.topics[topic];
        }

        return this;
    }

    /**
     * @param {string} topic 
     */
    resolve(topic) {
        topic = topic.replace(/\./g, "/");
        this.config.scope && (topic = this.config.scope + "/" + topic);
        return topic;
    }
}

if (typeof exports === "object") {
    exports.SimpleMQ = SimpleMQ;
    exports.default = SimpleMQ;
} else if (typeof window === "object") {
    window.SimpleMQ = SimpleMQ;
}