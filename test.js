/* global describe, it */

const SliMQ = require(".").default;
const assert = require("assert");
const fs = require("fs");

/** @type {SliMQ} */
let mq = new SliMQ({
    protocol: "mqtt",
    host: "test.mosquitto.org",
    port: 1883,
    scope: "test"
});

describe("SliMQ", function () {
    this.timeout(5000);

    it("should connect to the message broker", async () => {
        await mq.connect();
        assert(mq.channel.connected);
    });

    it("should transfer string", (done) => {
        mq.subscribe("send-string", (text) => {
            try {
                assert.strictEqual(text, "Hello, World!");
                done();
            } catch (err) {
                done(err);
            }
        });
        mq.publish("send-string", "Hello, World!");
    });

    it("should transfer number", (done) => {
        mq.subscribe("send-number", (num) => {
            try {
                assert.strictEqual(num, 12345);
                done();
            } catch (err) {
                done(err);
            }
        });
        mq.publish("send-number", 12345);
    });

    it("should transfer object", (done) => {
        mq.subscribe("send-object", (obj) => {
            try {
                assert.deepStrictEqual(obj, { foo: "bar" });
                done();
            } catch (err) {
                done(err);
            }
        });
        mq.publish("send-object", { foo: "bar" });
    });

    it("should transfer Buffer", (done) => {
        mq.subscribe("send-buffer", (buf) => {
            try {
                assert.deepStrictEqual(buf, Buffer.from("Hello, World!"));
                done();
            } catch (err) {
                done(err);
            }
        });
        mq.publish("send-buffer", Buffer.from("Hello, World!"));
    });

    it("should transfer Uint8Array as Buffer", (done) => {
        mq.subscribe("send-uint8array", (buf) => {
            try {
                assert.deepStrictEqual(buf, Buffer.from("Hello, World!"));
                done();
            } catch (err) {
                done(err);
            }
        });
        mq.publish("send-uint8array", Uint8Array.from(Buffer.from("Hello, World!")));
    });

    it("should transfer file", (done) => {
        let file = fs.readFileSync("./package.json");

        mq.subscribe("send-file", (buf) => {
            try {
                assert.deepStrictEqual(buf, file);
                done();
            } catch (err) {
                done(err);
            }
        });
        mq.publish("send-file", file);
    });

    it("should transfer data and reply to the sender", (done) => {
        mq.subscribe("send-reply", (text, reply) => {
            reply(text);
        });
        mq.publish("send-reply", "Hello, World!", text => {
            try {
                assert.strictEqual(text, "Hello, World!");
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it("should disconnect", async () => {
        await mq.disconnect();
    });
});