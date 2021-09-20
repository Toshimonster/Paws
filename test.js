var ws281x = require('rpi-ws281x');

let i =0

class Example {

    constructor() {
        // Current pixel position
        this.offset = 0;

        // Set my Neopixel configuration
        this.config = {leds:256, brightness:100, gpio:21, stripType:'grb'};

        // Configure ws281x
        ws281x.configure(this.config);
    }

    loop() {
        i++
	var pixels = new Uint32Array(this.config.leds);

        // Set a specific pixel
	let arr = [0,0,0]
	let r = 0 //blue
	let g = 0 //red
	let b = 0 //cyan?
	let c = 0 //red

	arr[Math.floor(i/256)%3] = i % 255

        pixels[this.offset] = ((arr[0] << 16) | (arr[1] << 8) | (arr[2])) >>> 0;

        // Move on to next
        this.offset = (this.offset + 1) % this.config.leds;

        // Render to strip
        ws281x.render(pixels);

	console.log(arr)
    }

    run() {
        // Loop every 100 ms
        setInterval(this.loop.bind(this), 25);

    }
};

var example = new Example();
example.run();
