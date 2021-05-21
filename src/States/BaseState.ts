import Driver from "../Driver";


export abstract class BaseState {
    name: string;

    protected constructor(name) {
        this.name = name
    }

    abstract executeStateFrame(driver: Driver, t: number, dt: number, ddt: number): Promise<any>
}