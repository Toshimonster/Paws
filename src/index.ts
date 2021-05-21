import Driver from "./Driver";
import * as Interfaces from './Interfaces'
import * as States from './States'

Object.defineProperty(Driver, "Interfaces", {
    configurable: false,
    enumerable: false,
    value: Interfaces
})

Object.defineProperty(Driver, "States", {
    configurable: false,
    enumerable: false,
    value: States
})

Driver.default = Driver
export = Driver