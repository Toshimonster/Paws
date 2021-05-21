import {BaseState} from "./States";
import {BaseInterface} from "./Interfaces";

const {performance} = require("perf_hooks")
const events = require("events")

interface driverOptions {
    showFPS?: boolean
}

export default class Driver extends events.EventEmitter {

    private animationLoopCondition: boolean = false
    private animationLoopStart: number = 0
    private readonly animationLoop = async (driver: Driver, old_dt = 0) => {
        const t = performance.now()
        const dt = t - driver.animationLoopStart
        const ddt = dt - old_dt

        if (this.options?.showFPS) console.log(`FPS: ${1 / ddt * 1e3}`);

        await driver._executeStateFrame(t, dt, ddt)

        if (this.animationLoopCondition) setImmediate(this.animationLoop, driver, dt);
    }
    private startAnimationLoop = (): Promise<void> => {
        this.animationLoopCondition = true
        return this.animationLoop(this)
    }
    private stopAnimationLoop = () => {
        this.animationLoopCondition = false
    }

    private _activeState: BaseState
    private _interfaces: Map<string, BaseInterface> = new Map<string, BaseInterface>()
    private _states: Map<string, BaseState> = new Map<string, BaseState>()
    get state(): string {
        return this._activeState.name
    }
    get interfaces(): string[] {
        return Array.from(this._interfaces.keys())
    }
    get states(): string[] {
        return Array.from(this._states.keys())
    }

    constructor(readonly options?:driverOptions) {
        super();
        this.emit("constructed")
    }

    addStates(states:BaseState[]) {
        for (let state of states) {
            this._states.set(state.name, state)
        }
    }

    addInterfaces(interfaces:BaseInterface[]) {
        for (let driverInterface of interfaces) {
            this._interfaces.set(driverInterface.name, driverInterface)
        }
    }

    start() {
        this.emit("ready", this)
        this.startAnimationLoop()
    }

    setState(state: string) {
        this.emit("stateChange")
        this._activeState = this._states.get(state)
    }

    getInterface(interfaceName: string): BaseInterface {
        return this._interfaces.get(interfaceName)
    }

    private async _executeStateFrame(t: number, dt: number, ddt: number) {
        await this._activeState.executeStateFrame(this, t, dt, ddt)
    }
}