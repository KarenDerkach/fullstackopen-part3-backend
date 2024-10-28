//Middleware
const unknownEndpoint = (req, resp) => {
    resp.status(404).send({ error: 'unknown endpoint' })
}
//Middleware
// controlador de solicitudes con endpoint desconocido
//contactRouter.use(unknownEndpoint)

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
//contactRouter.use(errorHandler)
module.exports = {
    unknownEndpoint,
    errorHandler
}