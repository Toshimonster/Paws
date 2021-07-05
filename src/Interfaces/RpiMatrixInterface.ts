import {BaseInterface} from "./BaseInterface";
import * as Matrix from "rpi-led-matrix"
import assert from 'assert';

interface RpiMatrixInterfaceOptions {
    matrixOpts: Matrix.MatrixOptions,
    runtimeOpts: Matrix.RuntimeOptions
}

export class RpiMatrixInterface extends BaseInterface {
    private readonly Matrix: Matrix.LedMatrixInstance
    private readonly size: number

    static defaultMatrixOptions = Matrix.LedMatrix.defaultMatrixOptions
    static defaultRuntimeOptions = Matrix.LedMatrix.defaultRuntimeOptions

    constructor(name, readonly options?:RpiMatrixInterfaceOptions) {
        super(name);
        this.Matrix = new Matrix.LedMatrix(options.matrixOpts, options.runtimeOpts)
        this.size = this.Matrix.height() * this.Matrix.width() * 3
    }

    async setBuffer(buffer: Buffer): Promise<void> {
        assert(buffer.length >= this.size, `The buffer given to the interface '${this.name}' is too short`)
        const slicedBuffer = buffer.slice(0, this.size)
        this.Matrix.drawBuffer(slicedBuffer)
        this.Matrix.sync()
    }
}