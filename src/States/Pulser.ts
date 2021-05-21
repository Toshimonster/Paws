import {BaseState} from "./BaseState";
import Driver from "../Driver";

interface PulserOptions {
    interfaces: string[],
    number?: 100
}

class PulserLed {
    constructor(
        readonly n: number,
        readonly f: number
    ) {}

    nextColor(t: number): number {
        const brightness = 0xFF & Math.max(0, 255 * (Math.sin(this.f * t / 1000)));
        return brightness
    }
}

export class Pulser extends BaseState {

    public readonly options: PulserOptions
    private pulsers: PulserLed[] = []
    private readonly buffer: Buffer

    constructor(name:string, options:PulserOptions) {
        super(name);
        this.options = options

        for (let i=0; i < (this.options.number || 100); i++) {
            this.pulsers.push(
                new PulserLed(i, 5 * Math.random())
            )
        }

        this.buffer = Buffer.allocUnsafe((this.options.number || 100)*4)
    }

    executeStateFrame(driver: Driver, t: number, dt: number, ddt: number): Promise<void> {
        for (let PulserLed of this.pulsers) {
            let c = PulserLed.nextColor(t)
            this.buffer.writeUInt16BE(c | c << 8, PulserLed.n*3)
            this.buffer.writeUInt8(c, PulserLed.n*3+2)
        }

        for (let DriverInterface of this.options.interfaces) {
            driver.getInterface(DriverInterface).setBuffer(this.buffer)
        }
        return Promise.resolve(undefined);
    }
}