import Paws from './index'

//import {Controller} from "./Server";

//const CTL = new Controller()

const Proto = new Paws.Driver({
    showFPS: true
})

Proto.addInterfaces([
    new Paws.Interfaces.TextInterface(
        "TestInterface",
        {
            y: 10,
            x: 10,
            symbol: "!"
        }
    ),

    new Paws.Interfaces.RpiMatrixInterface(
        "Front P3 Matrices",
        {
            matrixOpts: {
                ...Paws.Interfaces.RpiMatrixInterface.defaultMatrixOptions(),
                rows: 32,
                cols: 64,
                chainLength: 2
            },
            runtimeOpts: {
                ...Paws.Interfaces.RpiMatrixInterface.defaultRuntimeOptions(),
                gpioSlowdown: 1,
                dropPrivileges: 0,
            }
        }
    ),

    new Paws.Interfaces.Ws281xInterface(
        "Ws2812b", 61*2, {
            gpio: 21,
            stripType: 'ws2812',
            brightness: 10
        }
    )
])

Proto.addStates([
    new Paws.States.Pulser(
        "Pulser",
        {
            interfaces: [
                "Front P3 Matrices",
                "Ws2812b",
            ],
            number: 4096,
            intensity: 0.2,
            speed: 1
        }
    )
])

Proto.setState("Pulser")

Proto.on('ready', (driver) => {
    console.log('Ready!')
})

Proto.start()