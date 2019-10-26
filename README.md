# SimpleMQ

Instead of using MQTT protocol directly, this module uses
[bsp](https://github.com/hyurl/bsp) package to encode and decode data in order 
to transfer arbitrary types of data.

Any other program intend to connect and transmit data along with this module
must implement the encode and decode functions according to **bsp**
documentation.

**WARN**: Unlike traditional MQTT protocol, this module also uses `.` instead of
`/` to construct namespaces of the topic, for a more universal experience when
working with other protocols. 

## API

```ts
declare class SimpleMQ {
    constructor(config: mqtt.IClientOptions & {
        scope?: string;
    });
    connect(): Promise<this>;
    disconnect(): Promise<this>;
    publish(topic: string, data: any): this;
    subscribe(topic: string, handler: (data: any, packet: mqtt.Packet) => void): this;
    unsubscribe(topic: string, handler?: (data: any, packet: mqtt.Packet) => void): this;
}
```

**NOTICE**: If `scope` is provided in the config, it will be used as prefix to
every topic that the current instance binds and sends.

## Usage

In order to use this module, some prerequisites must be proceed.

### Node.js

First install [mqtt](https://github.com/mqttjs/MQTT.js#readme) and
[bsp](https://github.com/hyurl/bsp) packages in the project, they will be
auto-imported by SimpleMQ itself.

```ts
import SimpleMQ from "simple-mq";

const mq = new SimpleMQ({ /* config */ });

(async () => {
    await mq.connect();

    mq.subscribe("greeting", (text: string) => {
        // ...
    }).subscribe("transmit-file", (file: Buffer) => {
        // ...
    });
})();
```

### Browser

In the browser, the **mqtt** and **bsp** package must be explicitly loaded to
the global scope.

```html
<script src="mqtt.js"></script>
<script src="bsp.js"></script>
<script src="simple-mq.js"></script>
<script>
const mq = new SimpleMQ({ /* config */ });

(async () => {
    await mq.connect();

    mq.subscribe("greeting", (text: string) => {
        // ...
    }).subscribe("transmit-file", (file: Buffer) => {
        // ...
    });
})();
</script>
```

## Tips

It's always a good practice to split large files into chunks and send them
accordingly, then merge them in the receiver side.