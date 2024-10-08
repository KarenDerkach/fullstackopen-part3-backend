const { connection, Contact } = require('./dbConnection')
const express = require("express")
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



morgan.token('body', function (req, res) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})

// Usa Morgan con el formato tiny y agrega la lógica personalizada para el cuerpo
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);


let contacts = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const PORT = process.env.PORT || 3002
const startServer = async () => {
    try {
        await connection();  // Conectar a la base de datos antes de iniciar el servidor
        console.log('Conectado a MongoDB Atlas');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();

//ROUTES 

app.get("/api/persons", (req, resp) => {
    Contact.find({}).then(contacts => {
        resp.json(contacts)
    })


})


app.get("/info", (req, resp) => {
    const totalAmount = contacts.length
    const requestInfo = new Date()

    resp.send(`<section>
    <p>Phonebook has info for ${totalAmount} people </p>
    <p>Date of last request : ${requestInfo}</p>
    </section>`)
})
// //SHOW FORM
// app.get("/api/form", function (req, resp) {
//     resp.send(
//         '<html><head> \
//               <link href="/assets/style.css" rel="stylesheet"> \
//               </head><body>\
//                   <form method="POST" action="/api/form">\
//                   Name <input name="name" type="text"><br>\
//                   Number <input name="number" type="text"><br>\
//                   <br>\
//                   <input type="submit">\
//                   </form>\
//               </body></html>'
//     );
// });

// CREATE CONTACT
app.post("/api/persons", (req, resp, next) => {
    const body = req.body;


    // const maxId = contacts.length > 0 ? Math.max(...contacts.map(e => e.id)) : 0

    // if (!body.name || !body.number) {
    //     return resp.status(400).json({
    //         error: "name or number missing"
    //     })
    // }
    Contact.findOne({ number: body.number })
        .then(existingContact => {
            if (existingContact) {
                return resp.status(400).json({
                    error: "number must be unique"
                });
            }

            let contact = new Contact({
                name: body.name,
                number: body.number,

            })

            // contacts = contacts.concat(contact)
            contact.save()
                .then(savedContact => {

                    resp.json(savedContact)
                })
                .catch(error => next(error))
        })
        .catch(error => {
            console.error(error);
            resp.status(500).json({ error: "server error" });
        });


})
//FIND PERSON BY ID
app.get("/api/persons/:id", (req, resp, next) => {
    const id = req.params.id
    //const person = contacts.find((c) => c.id === id)
    Contact.findById(id)
        .then(person => {

            if (person) {
                resp.json(person)
            } else {
                resp.status(404).json({
                    error: "name or number missing"
                })
            }
        })
        // .catch(error => {
        //     console.error(error);
        //     resp.status(500).json({ error: "server error" });
        // });
        .catch(error => next(error))
})



// UPDATE PHONE NUMBER
app.patch("/api/persons/:id", (req, resp) => {
    const { id } = req.params;
    const { number } = req.body;

    if (!number) {
        return resp.status(400).json({ error: 'Phone number is required' });
    }

    Contact.findByIdAndUpdate(
        id,
        { number },
        {
            new: true,
            runValidators: true,
            context: 'query'
        } // Devuelve el documento actualizado y aplica validadores de esquema
    )
        .then(updatedContact => {
            if (updatedContact) {
                resp.json(updatedContact);
            } else {
                return resp.status(404).json({ error: "Contact not found" });
            }
        })
        .catch(error => {
            console.error(error);
            resp.status(500).json({ error: "Server error" });
        });
});

// DELETE CONTACT
app.delete("/api/persons/:id", (req, resp) => {
    const id = req.params.id;

    Contact.findByIdAndDelete(id)
        .then(deletedContact => {
            console.log(deletedContact);

            if (deletedContact) {
                return resp.status(204).end(); // Respuesta 204: No Content
            } else {
                return resp.status(404).json({ error: "Contact not found" });
            }
        })
        .catch(error => {
            console.error(error);
            resp.status(500).json({ error: "Server error" });
        });
});

//Middleware
const unknownEndpoint = (req, resp) => {
    resp.status(404).send({ error: 'unknown endpoint' })
}
//Middleware
// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// controlador de solicitudes que resulten en errores
app.use(errorHandler)

