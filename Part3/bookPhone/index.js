
const express = require("express")
const logger = require('./utils/logger')
const connection = require('./app')
const middleware = require('./utils/middleware')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

//Middleware que permite renderizar contenido estatico (HTML, por ejemplo del build realizado en nuestro front que se aloja en la carpeta 'dist')
app.use(express.static('dist'))

/**CORS:principios universales del funcionamiento de las aplicaciones web
 * Cuando visitas un sitio web (por ejemplo, http://example.com), el navegador emite una solicitud al servidor en el que está alojado el sitio web (example.com). La respuesta enviada por el servidor es un archivo HTML que puede contener una o más referencias a recursos externos alojados ya sea en el mismo servidor que example.com o en un sitio web diferente. Cuando el navegador ve referencia(s) a una URL en el HTML fuente, emite una solicitud. Si la solicitud se realiza utilizando la URL desde la cual se obtuvo el HTML fuente, entonces el navegador procesa la respuesta sin problemas. Sin embargo, si el recurso se obtiene utilizando una URL que no comparte el mismo origen (esquema, host, puerto) que el HTML fuente, el navegador tendrá que verificar el encabezado de respuesta Access-Control-Allow-Origin. Si contiene * en la URL del HTML fuente, el navegador procesará la respuesta; de lo contrario, el navegador se negará a procesarla y generará un error.
 */
app.use(cors())

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const contactRouter = require('./controllers/contacts')
app.use('/api/persons', contactRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

morgan.token('body', function (req) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})

// Usa Morgan con el formato tiny y agrega la lógica personalizada para el cuerpo
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);


// let contacts = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

const PORT = process.env.PORT || 3002
const startServer = async () => {
    try {
        await connection();  // Conectar a la base de datos antes de iniciar el servidor
        logger.info('Conectado a MongoDB Atlas');

        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Error al iniciar el servidor:', error);
    }
};

startServer();



