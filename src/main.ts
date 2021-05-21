import Paws from './index'
import {Interface} from "readline";

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
                rows: 64,
                cols: 64,
                chainLength: 2,
                ...Paws.Interfaces.RpiMatrixInterface.defaultMatrixOptions()
            },
            runtimeOpts: {
                dropPrivileges: false,
                ...Paws.Interfaces.RpiMatrixInterface.defaultRuntimeOptions()
            }
        }
    )
])

Proto.addStates([
    new Paws.States.Pulser(
        "Pulser",
        {
            interfaces: [
                "Front P3 Matrices"
            ],
            number: 1024,
            intensity: 0.1,
            speed: 0.2
        }
    )
])

console.log("hi")

Proto.setState("Pulser")

Proto.on('ready', (driver) => {
    console.log('Ready!')
})

Proto.start()