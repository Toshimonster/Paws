"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpi_led_matrix_1 = require("rpi-led-matrix");
const Driver_1 = require("./Driver");
const proto = new Driver_1.Paws();
new Driver_1.Paws.Interfaces.HzellerMatrix(proto, "Main P3 Panels", {
    ...rpi_led_matrix_1.LedMatrix.defaultMatrixOptions(),
    rows: 32,
    cols: 64,
    chainLength: 2,
}, {
    ...rpi_led_matrix_1.LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown: 2,
    dropPrivileges: 0
});
let Strip = new Driver_1.Paws.Interfaces.Ws281xStrip(16 * 16 + 61 + 61, {
    brightness: 10,
    stripType: 'ws2812',
    gpio: 21
});
new Driver_1.Paws.Interfaces.Ws281xMatrix(proto, "Top Ws2812b Matrix", null, Strip, 0);
new Driver_1.Paws.Interfaces.Ws281xMatrix(proto, "Left Ws2812b Circle", 0, Strip, 256);
new Driver_1.Paws.Interfaces.Ws281xMatrix(proto, "Right Ws2812b Circle", 0, Strip, 317);
new Driver_1.Paws.Interfaces.TestInterface(proto, "Test", {
    rowSize: 64
});
new Driver_1.Paws.States.GifFile(proto, "Happy", [
    {
        File: "./test.gif",
        Target: "Main P3 Panels",
        Transform: "mirror"
    },
    {
        File: "./bootup.gif",
        Target: "Top Ws2812b Matrix",
        Transform: "normal"
    },
    {
        File: "./Circle_1.gif",
        Target: "Left Ws2812b Circle",
        Transform: "normal"
    },
    {
        File: "./Circle_2.gif",
        Target: "Right Ws2812b Circle",
        Transform: "normal"
    }
]);
class Pulser {
    constructor(i, f) {
        this.i = i;
        this.f = f;
    }
    nextColor(t) {
        return 0xFF & Math.max(0, 255 * (Math.sin(this.f * t / 1000)));
    }
}
const pulsers = [];
for (let i = 0; i < 16 * 16 + 61 + 61; i++) {
    pulsers.push(new Pulser(i, 5 * Math.random()));
}
let i = 0;
new Driver_1.Paws.States.CustomState(proto, "Pulser", (driver, time) => {
    console.log(time);
    let buffer = Buffer.allocUnsafe((16 * 16 + 61 + 61) * 3);
    pulsers.forEach(pulser => {
        let c = pulser.nextColor(time);
        buffer.writeUInt8(c, pulser.i * 3);
        buffer.writeUInt8(c, pulser.i * 3 + 1);
        buffer.writeUInt8(c, pulser.i * 3 + 2);
    });
    if (time > i * 25) {
        i++;
        driver.getInterface("Top Ws2812b Matrix").runBuffer(buffer.slice(0, 16 * 16 * 3));
        driver.getInterface("Left Ws2812b Circle").runBuffer(buffer.slice(16 * 16 * 3, 16 * 16 * 3 + 61 * 3));
        driver.getInterface("Right Ws2812b Circle").runBuffer(buffer.slice(16 * 16 * 3 + 61 * 3, 16 * 16 * 3 + 61 * 3 + 61 * 3));
    }
}, (driver) => {
});
new Driver_1.Paws.Transitions.Fade(proto, "Fade");
proto.setState("Happy");
proto.start()
    .catch(console.error)
    .then(() => {
    console.log("Started");
    //program logic
    //proto.transition("otherState", "Fade")
});
//# sourceMappingURL=index.js.map