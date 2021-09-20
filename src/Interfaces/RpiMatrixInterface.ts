import {BaseInterface} from "./BaseInterface";
import * as Matrix from "rpi-led-matrix"
import {GpioMapping, MuxType, RowAddressType, ScanMode} from "rpi-led-matrix";

interface RpiMatrixInterfaceOptions {
    matrixOpts: Matrix.MatrixOptions,
    runtimeOpts: Matrix.RuntimeOptions
}

export class RpiMatrixInterface extends BaseInterface {
    private readonly Matrix: Matrix.LedMatrixInstance
    private readonly Buffer: Buffer

    constructor(name, readonly options: { runtimeOpts: any; matrixOpts: { pwmBits: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11; hardwareMapping: GpioMapping; scanMode: ScanMode; pwmLsbNanoseconds: number; rows: number; rowAddressType: RowAddressType; inverseColors: boolean; ledRgbSequence: "RGB" | "BGR" | "BRG" | "RBG" | "GRB" | "GBR"; brightness: number; multiplexing: MuxType; parallel: 1 | 2 | 3 | 4; chainLength: number; pwmDitherBits: number; showRefreshRate: boolean; pixelMapperConfig: string; cols: number; disableHardwarePulsing: boolean } }) {
        super(name);
        this.Matrix = new Matrix.LedMatrix({
            ...options.matrixOpts,
            ...Matrix.LedMatrix.defaultMatrixOptions()
            }, {
            ...options.runtimeOpts,
            ...Matrix.LedMatrix.defaultRuntimeOptions()
            })
        this.Buffer = Buffer.allocUnsafe(this.Matrix.height() * this.Matrix.width() * 3)
    }

    async setBuffer(buffer: Buffer): Promise<void> {
        this.Matrix.height()
        this.Matrix.drawBuffer(buffer)
    }

    static defaultMatrixOptions() {
        return Matrix.LedMatrix.defaultMatrixOptions()
    }

    static defaultRuntimeOptions() {
        return Matrix.LedMatrix.defaultRuntimeOptions()
    }
}