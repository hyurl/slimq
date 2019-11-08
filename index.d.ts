import * as mqtt from "mqtt";

export declare class SliMQ {
    protected config: mqtt.IClientOptions & { scope?: string; };
    protected topics: { [topic: string]: (data: any, reply?: (data: any) => void) => void };
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
export default SliMQ;