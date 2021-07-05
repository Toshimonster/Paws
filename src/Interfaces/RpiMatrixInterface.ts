import {BaseInterface} from "./BaseInterface";
import * as Matrix from "rpi-led-matrix"

interface RpiMatrixInterfaceOptions {
    matrixOpts: Matrix.MatrixOptions,
    runtimeOpts: Matrix.RuntimeOptions
}

export class RpiMatrixInterface extends BaseInterface {
    private readonly Matrix: Matrix.LedMatrixInstance
    private readonly Buffer: Buffer

    constructor(name, readonly options:RpiMatrixInterfaceOptions) {
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
}