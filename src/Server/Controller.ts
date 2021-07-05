const Bleno = require("bleno")
const OS = require("os")

const GATT_Descriptor = {
    //From https://btprodspecificationrefs.blob.core.windows.net/assigned-values/16-bit%20UUID%20Numbers%20Document.pdf
    Characteristic_User_Description: 2901,
    Characteristic_Presentation_Format: 2904
}
const GATT_Characteristic_Presentation_Formats = {
    //From https://developer.nordicsemi.com/nRF5_SDK/nRF51_SDK_v4.x.x/doc/html/group___b_l_e___g_a_t_t___c_p_f___f_o_r_m_a_t_s.html
    RFU: 0,
    BOOLEAN: 1,
    TWO_BIT: 2,
    NIBBLE: 3,
    UINT8: 4,
    UINT16: 6,
    UINT32: 8,
    UINT64: 10,
    UINT128: 11,
    SINT8: 12,
    SINT16: 14,
    SINT32: 16,
    SINT64: 18,
    SINT128: 19,
    FLOAT32: 20,
    FLOAT64: 21,
    SFLOAT: 22,
    FLOAT: 23,
    DUINT16: 24,
    UTF8S: 25,
    UTF16S: 26,
    STRUCT: 27
}
export class Controller {
    public readonly Name: string = "P.A.W.S Controller"
    private serviceUuids: ReadonlyArray<string> = []

    constructor() {
        Bleno.on("stateChange", state => {
            console.log(`on -> stateChange: ${state}`)

            if (state === 'poweredOn') {
                Bleno.startAdvertising(this.Name, this.serviceUuids, console.error)
            } else {
                Bleno.stopAdvertising()
            }
        })

        Bleno.on("advertisingStart", (err) => {
            console.log(`on -> advertisingStart: ${err ? `error ${err}` : 'success'}`);

            if (!err) {
                Bleno.setServices([
                    new Bleno.PrimaryService({
                        uuid: '',
                        characteristics: [
                            new Bleno.Characteristic({
                                uuid: '',
                                properties: [],
                                secure: [],
                                value: null,
                                descriptors: [
                                    new Bleno.Descriptor({
                                        uuid: GATT_Descriptor.Characteristic_User_Description,
                                        value: 'The uptime for the operating system'
                                    }),
                                    new Bleno.Descriptor({
                                        uuid: GATT_Descriptor.Characteristic_Presentation_Format,
                                        value: GATT_Characteristic_Presentation_Formats.UINT64
                                    })
                                ],
                                onReadRequest: (offset, callback) => {
                                    if (offset) {
                                        callback(Bleno.Characteristic.RESULT_ATTR_NOT_LONG, null)
                                    } else {
                                        let data = Buffer.allocUnsafe(8)
                                        data.writeBigUInt64BE(OS.uptime())
                                        callback(Bleno.Characteristic.RESULT_SUCCESS, data)
                                    }
                                },
                                onWriteRequest: null,
                                onSubscribe: null,
                                onUnsubscribe: null,
                                onNotify: null,
                                onIndicate: null
                            })
                        ]
                    })
                ])
            }
        })
    }

    release() {
        Bleno.removeAllListeners("stateChange")
    }

}