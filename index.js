/* global mqtt, bsp, window */
"use strict";

const bsp = require("bsp");
const sequid = require("sequid").default;

class SliMQ {
    /**
     * @param {{[x: string]: any, scope?: string}} config 
     */
    constructor(config) {
        this.config = config;
        /** @type { {[topic: string]: Set<Function>} } */
        this.topics = Object.create(null);
        this.serial = sequid(0, true);
        this.channel = null;
    }

    /**
     * @returns {Promise<this>}
     */
    connect() {
        return new Promise((resolve, reject) => {
            if (typeof mqtt === "undefined") {
                global["mqtt"] = require("mqtt");
            }

            this.channel = mqtt.connect(this.config);
            this.channel.once("connect", () => {
                resolve(this);
            }).once("error", (err) => {
                reject(err);
            }).on("message", (topic, payload) => {
                let handlers = this.topics[topic];

                if (handlers && handlers.size > 0) {
                    let data, replyId;
                    let reply = (data) => {
                        replyId && this.publish(replyId, data);
                    };

                    try {
                        [data, replyId] = bsp.decode(payload, []);
                    } catch (e) {
                        data = payload;
                    }

                    for (let handler of handlers.values()) {
                        handler.call(void 0, data, reply);
                    }
                }
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
     * @param {{ qos?: 0 | 1 | 2, retain?: boolean, dup?: boolean }} options
     * @param {(data: any) => void} reply
     */
    publish(topic, data, options = null, reply = null) {
        topic = this.resolve(topic);

        if (typeof options === "function") {
            reply = options;
            options = null;
        }

        if (reply) {
            let { clientId } = this.channel.options;
            let replyId = `${topic}@${clientId}$${this.serial.next().value}`;

            this.subscribe(replyId, (data) => {
                this.unsubscribe(replyId);
                reply(data);
            });
            this.channel.publish(topic, bsp.encode(data, replyId), options);
        } else {
            this.channel.publish(topic, bsp.encode(data), options);
        }

        return this;
    }

    /**
     * @param {string} topic 
     * @param {{ qos: 0 | 1 | 2 }} [options]
     * @param {(data: any, reply: (data: any) => void) => void} handler 
     */
    subscribe(topic, options, handler) {
        topic = this.resolve(topic);

        if (typeof options === "function") {
            handler = options;
            options = null;
        }

        if (!this.topics[topic]) {
            this.channel.subscribe(topic, options);
            this.topics[topic] = new Set([handler]);
        } else {
            this.topics[topic].add(handler);
        }

        return this;
    }

    /**
     * @param {string} topic 
     * @param {(data: any, reply: (data: any) => void) => void} handler 
     */
    unsubscribe(topic, handler = null) {
        topic = this.resolve(topic);

        if (this.topics[topic]) {
            if (handler) {
                this.topics[topic].delete(handler);
            } else {
                this.channel.unsubscribe(topic);
                delete this.topics[topic];
            }
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

exports.SliMQ = SliMQ;
exports.default = SliMQ;