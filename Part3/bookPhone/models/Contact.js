
const mongoose = require('mongoose');

// Definir esquema y modelo
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        required: true
    },
    number: {
        type: String,
        // validate: {
        //     validator: function (v) {
        //         return /\d{3}-\d{3}-\d{4}/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid phone number!`
        // },
        required: [true, 'User phone number required']
    }

});
//Seteo que permite convertir en string el id que genera mongodb porque originalmente es un objeto
contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Contact = mongoose.model('Contact', contactSchema);

// Función para guardar un contacto (ejemplo, pero no cierre la conexión)
const saveContact = async (name, number) => {
    const contact = new Contact({
        name,
        number,
    });

    try {
        const result = await contact.save();
        console.log('Contacto guardado:', result);
        return result;
    } catch (error) {
        console.log("Error guardando el contacto:", error);
        throw error;
    }
};

// No cerrar la conexión después de cada operación, deja que Express la maneje
module.exports = {
    Contact,
    saveContact,
};