const express = require("express")
var morgan = require('morgan')
const { connection, Contact } = require('./dbConnection')
const cors = require('cors')

const app = express()
app.use(express.static('dist'))

/**CORS:principios universales del funcionamiento de las aplicaciones web
 * Cuando visitas un sitio web (por ejemplo, http://example.com), el navegador emite una solicitud al servidor en el que está alojado el sitio web (example.com). La respuesta enviada por el servidor es un archivo HTML que puede contener una o más referencias a recursos externos alojados ya sea en el mismo servidor que example.com o en un sitio web diferente. Cuando el navegador ve referencia(s) a una URL en el HTML fuente, emite una solicitud. Si la solicitud se realiza utilizando la URL desde la cual se obtuvo el HTML fuente, entonces el navegador procesa la respuesta sin problemas. Sin embargo, si el recurso se obtiene utilizando una URL que no comparte el mismo origen (esquema, host, puerto) que el HTML fuente, el navegador tendrá que verificar el encabezado de respuesta Access-Control-Allow-Origin. Si contiene * en la URL del HTML fuente, el navegador procesará la respuesta; de lo contrario, el navegador se negará a procesarla y generará un error.
 */
app.use(cors())

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//Middleware
// Función personalizada para combinar el formato 'tiny' y registrar el cuerpo en las solicitudes POST
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

const { v4: uuidv4 } = require('uuid');

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
app.listen(PORT, async () => {
    try {
        console.log(`server running on port ${PORT}`)
        //await connection()
        console.log('CONNECTION DB OK')
    } catch (err) {
        console.log(err);

    }
})

//ROUTES 

app.get("/api/persons", (req, resp) => {
    resp.send(contacts)

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
app.post("/api/persons", (req, resp) => {
    const body = req.body;


    const maxId = contacts.length > 0 ? Math.max(...contacts.map(e => e.id)) : 0

    if (!body.name || !body.number) {
        return resp.status(400).json({
            error: "name or number missing"
        })
    }
    const findDuplicate = contacts.find(elem => elem.name === body.name)

    if (findDuplicate) {
        return resp.status(400).json({
            error: "name must be unique"
        })
    }
    let contact = {
        name: body.name,
        number: body.number,
        id: maxId + 1,
    }

    contacts = contacts.concat(contact)

    resp.json(contact)
})
//FIND PERSON BY ID
app.get("/api/persons/:id", (req, resp) => {
    const id = req.params.id
    const person = contacts.find((c) => c.id === id)
    if (person) {
        resp.json(person)
    } else {
        resp.status(404).json({
            error: "name or number missing"
        })
    }
})



app.patch("/api/persons/:id", (req, resp) => {
    const { id } = req.params
    const { number } = req.body
    if (!number) {
        return resp.status(400).json({ error: 'Phone number is required' });
    }
    const contact = contacts.find(elem => elem.id === id)
    if (contact) {
        contact.number = number;
        resp.json(contact)
    } else {
        return resp.status(404).json({ error: "Something was wrong" })
    }
})

// DELETE
app.delete("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id)

    const deletedID = contacts.find(elem => elem.id === id)


    if (deletedID) {
        contacts = contacts.filter(elem => elem.id !== id)
        return resp.status(204).json({ contacts });

    } else {
        return resp.status(404).json("error")
    }
})

//Middleware
const unknownEndpoint = (req, resp) => {
    resp.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


