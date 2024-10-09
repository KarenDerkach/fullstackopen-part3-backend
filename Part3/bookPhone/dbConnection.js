require('dotenv').config();
const mongoose = require('mongoose');
const { URL_MONGODB } = process.env;

mongoose.set('strictQuery', false);

// Función para conectar a la base de datos
const connection = async () => {
    try {
        await mongoose.connect(URL_MONGODB);
        console.log("Se conectó a la base de datos");
    } catch (error) {
        console.log("Error conectando a la base de datos:", error);
        throw error; // Lanza el error para manejarlo donde se llame la conexión
    }
};

// Métodos de escucha de eventos de la conexión
mongoose.connection.on('error', (error) => {
    console.log("Error en la conexión:", error);
});

// Definir esquema y modelo
const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
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
    connection,
    Contact,
    saveContact,
};
