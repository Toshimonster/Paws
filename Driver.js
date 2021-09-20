"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paws = void 0;
const Interfaces = __importStar(require("./Interfaces"));
const States = __importStar(require("./States"));
const Transitions = __importStar(require("./Transitions"));
const assert_1 = require("assert");
/**
 * The Protogen Animation Warehouse Service
 * @class Paws
 */
class Paws {
    constructor() {
        this.Interfaces = new Map();
        this.States = new Map();
        this.Transitions = new Map();
        this.Frames = 0;
        this.RepeatFrames = true;
        console.log("Constructed Driver");
    }
    /**
     * Adds a interface to the driver
     * @param Interface
     */
    addInterface(Interface) {
        console.log(`Adding Interface ${Interface.name}`);
        this.Interfaces.set(Interface.name, Interface);
    }
    /**
     * Adds a state to the driver
     * @param State
     */
    addState(State) {
        console.log(`Adding State ${State.name}`);
        this.States.set(State.name, State);
    }
    /**
     * Adds a transition to the driver
     * @param Transition
     */
    addTransition(Transition) {
        console.log(`Adding Transition ${Transition.name}`);
        this.Transitions.set(Transition.name, Transition);
    }
    /**
     * Sets the state of the driver.
     * @param state
     */
    setState(state) {
        console.log(`Setting state to ${state}`);
        if (!this.States.has(state))
            throw new assert_1.AssertionError({
                message: "Invalid state",
                expected: this.States.keys(),
                actual: state
            });
        this.ActiveState = this.States.get(state);
    }
    /**
     * Loads all interfaces, states, and transitions by executing their respective .load() functions
     * @public
     */
    load() {
        console.log("Loading Interfaces");
        let promises = [];
        this.Interfaces.forEach(value => {
            promises.push(value.load());
        });
        this.States.forEach(value => {
            promises.push(value.load());
        });
        this.Transitions.forEach(value => {
            promises.push(value.load());
        });
        return Promise.all(promises);
    }
    /**
     * Gets a interface
     * @param interfaceName
     */
    getInterface(interfaceName) {
        return this.Interfaces.get(interfaceName);
    }
    /**
     * Wrapper function to continuously run the runFrame function,
     * Given that this.RepeatFrames is true. Note that the previous frame
     * has to complete before the current frame is executed.
     * @private
     */
    async runFrames() {
        console.log("Frames Running");
        while (this.RepeatFrames) {
            await new Promise(((resolve, reject) => {
                setTimeout(resolve, 1);
            }));
            await this.runFrame();
        }
        return;
    }
    /**
     * Runs a singular frame to the active state.
     * Note that the active state might be a transition
     * @private
     */
    async runFrame() {
        await this.ActiveState.executeFrame();
        this.Frames++;
    }
    /**
     * Starts the Paws Instance
     * @returns Promise<void>
     */
    async start() {
        this.load()
            .then(async () => {
            console.log("Driver Loaded");
            return await this.runFrames();
        });
    }
}
exports.Paws = Paws;
Paws.Interfaces = Interfaces;
Paws.States = States;
Paws.Transitions = Transitions;
//# sourceMappingURL=Driver.js.map