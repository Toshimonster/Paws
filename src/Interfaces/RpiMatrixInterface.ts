import {BaseInterface} from "./BaseInterface";
import * as Matrix from "rpi-led-matrix"

interface RpiMatrixInterfaceOptions {
    matrixOpts: Matrix.MatrixOptions,
    runtimeOpts: Matrix.RuntimeOptions
}

export class RpiMatrixInterface extends BaseInterface {
    private readonly Matrix: Matrix.LedMatrixInstance
    private readonly Buffer: Buffer

    static defaultMatrixOptions = Matrix.LedMatrix.defaultMatrixOptions
    static defaultRuntimeOptions = Matrix.LedMatrix.defaultRuntimeOptions

    constructor(name, readonly options?:RpiMatrixInterfaceOptions) {
        super(name);
        this.Matrix = new Matrix.LedMatrix(options.matrixOpts, options.runtimeOpts)
        this.Buffer = Buffer.allocUnsafe(this.Matrix.height() * this.Matrix.width() * 3)
    }

    async setBuffer(buffer: Buffer): Promise<void> {
        this.Matrix.height()
        this.Matrix.drawBuffer(buffer)
    }
}