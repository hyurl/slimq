import * as mqtt from "mqtt";

export declare class SimpleMQ {
    protected config: mqtt.IClientOptions & { scope?: string; };
    protected topics: { [topic: string]: Set<(data: any, packet: mqtt.Packet) => void> };
    protected channel: mqtt.Client;
    constructor(config: mqtt.IClientOptions & { scope?: string; });
    connect(): Promise<this>;
    disconnect(): Promise<this>;
    publish(topic: string, data: any): this;
    subscribe(topic: string, handler: (data: any, packet: mqtt.Packet) => void): this;
    unsubscribe(topic: string, handler?: (data: any, packet: mqtt.Packet) => void): this;
}
export default SimpleMQ;