// require('dotenv').config();
// const mongoose = require('mongoose');
// const { URL_MONGODB } = process.env;

// mongoose.set('strictQuery', false);

// // Función para conectar a la base de datos
// const connection = async () => {
//     try {
//         await mongoose.connect(URL_MONGODB);
//         console.log("Se conectó a la base de datos");
//     } catch (error) {
//         console.log("Error conectando a la base de datos:", error);
//     }
// };

// // Métodos de escucha
// mongoose.connection.on('error', (error) => {
//     console.log("Error en la conexión:", error);
// });

// // Definir esquema y modelo
// const contactSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// });

// const Contact = mongoose.model('Contact', contactSchema);

// // Función para guardar un contacto
// const saveContact = async () => {
//     const contact = new Contact({
//         name: 'Karen',
//         number: '12333333',
//     });

//     try {
//         const result = await contact.save();
//         console.log('Contact saved!', result);
//     } catch (error) {
//         console.log("Error guardando el contacto:", error);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// // Conectar a la base de datos y guardar el contacto
// (async () => {
//     await connection();
//     await saveContact();
// })();

// module.exports = {
//     connection,
//     Contact,
// };
