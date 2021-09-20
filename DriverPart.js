"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverPart = void 0;
/**
 * Represents a part for the PAWS driver
 * @abstract
 * @class DriverPart
 */
class DriverPart {
    constructor(driver, name) {
        this.name = name;
        this.driver = driver;
    }
    /**
     * Loads the part
     * @abstract
     */
    load() { }
}
exports.DriverPart = DriverPart;
//# sourceMappingURL=DriverPart.js.map