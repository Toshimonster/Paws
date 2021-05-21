import {BaseInterface} from "./BaseInterface";
import Ws281x from "@gbkwiatt/node-rpi-ws281x-native";

export class Ws281xInterface extends BaseInterface {
    private readonly Channel: Ws281x.SingleInterfaceChannel;

    constructor(name, numLeds: number, readonly options?:Ws281x.SingleInterfaceChannelOptions) {
        super(name);
        this.Channel = Ws281x(numLeds, options)
    }

    async setBuffer(buffer: Buffer): Promise<void> {
        const slicedBuffer = buffer.slice(0, this.Channel.count)
        for (let i = 0; i < this.Channel.array.length; i++) {
            let data = slicedBuffer.slice(1, 4)
            this.Channel.array[i] = (data[0] << 16) | (data[1] << 8) | data[2]
        }
        this.Channel.render()
        //await new Promise(resolve => setTimeout(resolve, 1))
    }
}