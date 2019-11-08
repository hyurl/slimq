# Slim Message Queue

Instead of using MQTT protocol directly, this module uses
[bsp](https://github.com/hyurl/bsp) package to encode and decode data in order 
to transfer arbitrary types of data.

Any other program intend to connect and transmit data along with this module
must implement the encode and decode functions according to **bsp**
documentation.

**WARN**: Unlike traditional MQTT protocol, this module also uses `.` instead of
`/` to construct namespace of the topic, for a more universal experience when
working with other protocols.

## API

```ts
declare class SliMQ {
    protected config: mqtt.IClientOptions & { scope?: string; };
    protected topics: { [topic: string]: (data: any) => void };
    protected channel: mqtt.Client;
    constructor(config: mqtt.IClientOptions & { scope?: string; });
    connect(): Promise<this>;
    disconnect(): Promise<this>;
    publish<T = any, R = any>(topic: string, data: T, reply?: (data: R) => void): this;
    publish<T = any, R = any>(topic: string, data: T, options: {
        qos?: 0 | 1 | 2;
        retain?: boolean;
        dup?: boolean;
    }, reply?: (data: R) => void): this;
    subscribe<T = any, R = any>(topic: string, handler: (data: T, reply: (data: R) => void) => void): this;
    subscribe<T = any, R = any>(topic: string, options: {
        qos: 0 | 1 | 2
    }, handler: (data: T, reply: (data: R) => void) => void): this;
    unsubscribe(topic: string): this;
}
```

**NOTE**:
1. If `scope` is provided in the config, it will be used as prefix to every
    topic that the current instance binds and sends.
2. If calls subscribe on the same topic multiple times, the later ones will
    erase the former ones.

## Usage

In order to use this module, some prerequisites must be proceed.

### Node.js

First install [mqtt](https://github.com/mqttjs/MQTT.js#readme) and
[bsp](https://github.com/hyurl/bsp) packages in the project, they will be
auto-imported by SliMQ itself.

```ts
import SliMQ from "slimq";

const mq = new SliMQ({ /* config */ });

(async () => {
    await mq.connect();

    mq.subscribe<string>("greeting", (text) => {
        // `text` would be a string.
    }).subscribe<Buffer>("transmit-file", (file) => {
        // `file` would be a buffer.
    }).subscribe<string, string>("send-reply", (text, reply) => {
        // `text` would be a string, and `reply` must take a string argument.
        reply("You just sent: " + text);
    });

    mq.publish("greeting", "Hello, World!");
    mq.publish("transmit-file", fs.readFileSync("some-file.txt", "utf8"));
    mq.publish<string, string>("send-reply", "Hello, World!", (text) => {
        console.log(text); // You just sent: Hello, World!
    });
})();
```

### Browser

In the browser, the **mqtt** package must be explicitly loaded to the global
scope.

```html
<script src="https://unpkg.com/mqtt@3.0.0/dist/mqtt.min.js"></script>
<script src="./bundle/slimq.js"></script>
<script>
const mq = new SliMQ({ /* config */ });

(async () => {
    await mq.connect();

    mq.subscribe<string>("greeting", (text) => {
        // `text` would be a string.
    }).subscribe<Uint8Array>("transmit-file", (file) => {
        // `file` would be a Uint8Array instance.
    }).subscribe<string, string>("send-reply", (text, reply) => {
        // `text` would be a string, and `reply` must take a string argument.
        reply("You just sent: " + text);
    });
})();
</script>
```

## Tips

It's always a good practice to split large files into chunks and send them
accordingly, then merge them in the receiver side.
