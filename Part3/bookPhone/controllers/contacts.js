const contactRouter = require('express').Router()
const { Contact } = require('../models/Contact')
//ROUTES 

contactRouter.get("/", (req, resp) => {
    Contact.find({}).then(contacts => {
        resp.json(contacts)
    })


})


contactRouter.get("/info", (req, resp) => {
    const totalAmount = Contact.length
    const requestInfo = new Date()

    resp.send(`<section>
    <p>Phonebook has info for ${totalAmount} people </p>
    <p>Date of last request : ${requestInfo}</p>
    </section>`)
})
// //SHOW FORM
// contactRouter.get("/api/form", function (req, resp) {
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
contactRouter.post("/", (req, resp, next) => {
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
contactRouter.get("/:id", (req, resp, next) => {
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
contactRouter.patch("/:id", (req, resp) => {
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
contactRouter.delete("/:id", (req, resp) => {
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



module.exports = contactRouter