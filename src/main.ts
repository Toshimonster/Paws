import Paws from './index'

const Proto = new Paws({
    showFPS: true
})

Proto.addInterfaces([
    new Paws.Interfaces.TextInterface(
        "TextInterface",
        {
            y: 10,
            x: 10,
            symbol: "!"
        }
    )
])

Proto.addStates([
    new Paws.States.Pulser(
        "Pulser",
        {
            color: {
                r: 255,
                g: 0,
                b: 100
            },
            interfaces: [
                "TextInterface"
            ]
        }
    )
])

console.log("hi")

Proto.setState("Pulser")

Proto.on('ready', (driver) => {
    console.log('Ready!')
})

Proto.start()