import * as mqtt from "mqtt";

export declare class SliMQ {
    protected config: mqtt.IClientOptions & { scope?: string; };
    protected topics: { [topic: string]: Set<(data: any, packet: mqtt.Packet) => void> };
    protected channel: mqtt.Client;
    constructor(config: mqtt.IClientOptions & { scope?: string; });
    connect(): Promise<this>;
    disconnect(): Promise<this>;
    publish(topic: string, data: any, reply?: (data: any) => void): this;
    subscribe(topic: string, handler: (data: any, reply: (data: any) => void) => void): this;
    unsubscribe(topic: string, handler?: (data: any, reply: (data: any) => void) => void): this;
}
export default SliMQ;