require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const app = express();
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.log("Virheen käsittely")
  //console.error(error.message)
  console.log("error name: ", error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}



//Source: https://stackoverflow.com/questions/51409771/logging-post-body-size-using-morgan-when-request-is-received
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'));
app.use(cors())


app.get("/info", (req, res) => {
  res.send(`Phonebook contains ${persons.length} persons. 
    ${new Date().toISOString()}`);
});

app.get("/api/persons", (req, res) => {
  console.log("get all persons")
  Person.find({}).then(persons => {
    console.log(persons)
    res.json(persons)
  })
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  if (persons.some(person => person.id === id)) {
    res.json(persons.filter(person => person.id === id));
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if(!body){
    return res.status(400).json({error: 'Number and name missing'})
  }
  const name = body.name
  const number = body.number
  if(!name){
    return res.status(400).json({error: 'name is missing'})
  }
  if(!number){
    return res.status(400).json({error: 'number is missing'})
  }

  const newPerson = new Person({name: name, number: number});
  newPerson.save().then(savedPerson => {
    res.json(savedPerson);
  })
  .catch(error => next(error))
  

})

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  console.log("Delete ", id)
  Person.findByIdAndDelete(id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
});

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
