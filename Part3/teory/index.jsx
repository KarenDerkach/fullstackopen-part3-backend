/**
 * FORMA DE CREAR UN SERVIDOR CON NODEJS
 * 
 * const http = require("http");

let notes = [
  ...
]

const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(notes));
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
 * 
 */

//FORMA DE CREAR UN SERVIDOR CON EXPRESS:
/**
 * Es posible implementar nuestro código de servidor directamente con el servidor web http integrado de Node. Sin embargo, es engorroso, especialmente una vez que la aplicación aumenta de tamaño.

Se han desarrollado muchas librerías para facilitar el desarrollo del lado del servidor con Node, al ofrecer una interfaz más agradable para trabajar con el módulo http integrado. 
Estas librerías tienen como objetivo proporcionar una mejor abstracción para los casos de uso general que generalmente requerimos para construir un servidor backend. 
Por lejos, la librería más popular destinada a este propósito es Express.
 */

const express = require("express");
const app = express();
//MIDDLEWARE : Los middleware son funciones que se pueden utilizar para manejar objetos de request y response.
app.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  console.log("BODYYY", body);
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
