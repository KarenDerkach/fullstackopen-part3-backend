const express = require("express")
const cors = require('cors')

const app = express()
app.use(express.static('dist'))
app.use(cors())

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const { v4: uuidv4 } = require('uuid');
const randomUuid = uuidv4()
console.log("UUID", randomUuid);
let contacts = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, resp) => {
    resp.json(contacts)
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
        id: uuidv4(),
    }

    contacts = contacts.concat(contact)

    resp.json(contact)
})
//FIND PERSON BY ID
app.get("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id)
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
    const id = req.params.id
    contacts = contacts.filter(elem => elem.id !== id)
    if (contacts) {
        return resp.status(204).json("deleted contact");

    } else {
        return resp.status(404).json("error")
    }
})



const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
