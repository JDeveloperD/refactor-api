const model = require('./model')
const { customAlphabet } = require('nanoid')

// Add client

function addPasajero(Pasajero) {

    const { nombres, lugarEmbarque } = Pasajero
    const nanoid = customAlphabet('1234567890', 10)

    const item = new model({
        _id: nanoid(),
        nombres,
        lugarEmbarque
    })
    item.save()
}

//List client

function listPasajero(codigo) {

    return new Promise((resolver, rechazar) => {
        // resolver(model.find(codigo)
        //     .populate('_id')
        //     .populate('nombreZona')
        // )
        resolver(model.find(codigo))
    })

}

//Update client

async function updatePasajero(codigo, Pasajero) {

    // const { nombre, ruc, direccion, urbanizacion, email, horario, comentarios } = cliente

    const doc_zona = await model.findOne({ _id: codigo })

    for (key in Pasajero) {
        doc_zona[key] = Pasajero[key]
    }

    return doc_zona.save()

}

async function deletePasajero(codigo) {

    await model.deleteOne(codigo);

}


module.exports = {
    add: addPasajero,
    list: listPasajero,
    update: updatePasajero,
    delete: deletePasajero
}
