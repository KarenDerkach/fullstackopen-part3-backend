const mongoose = require('mongoose');
const logger = require('./utils/logger')
const config = require('./utils/config')

mongoose.set('strictQuery', false);


// Función para conectar a la base de datos
const connection = async () => {
    try {
        await mongoose.connect(config.URL_MONGODB);
        logger.info("Se conectó a la base de datos");
    } catch (error) {
        logger.info("Error conectando a la base de datos:", error);
        throw error; // Lanza el error para manejarlo donde se llame la conexión
    }
};

// Métodos de escucha de eventos de la conexión
mongoose.connection.on('error', (error) => {
    logger.info("Error en la conexión:", error);
});


module.exports = connection