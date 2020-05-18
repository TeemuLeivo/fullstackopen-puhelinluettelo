const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const app = express();

//Source: https://stackoverflow.com/questions/51409771/logging-post-body-size-using-morgan-when-request-is-received
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'));
app.use(cors())
app.use(express.json())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  }
];

app.get("/info", (req, res) => {
  res.send(`Phonebook contains ${persons.length} persons. 
    ${new Date().toISOString()}`);
});

app.get("/api/persons", (req, res) => {
  console.log("get all persons")
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  if (persons.some(person => person.id === id)) {
    res.json(persons.filter(person => person.id === id));
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
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
  if(persons.some(person => person.name === name)){
    return res.status(400).json({error: 'name must be unique'})
  }
  const randomId = Math.floor(Math.random() * 10000000);
  const newPerson = {id: randomId, name: name, number: number};
  persons = persons.concat(newPerson);
  res.json(newPerson);

})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log("Delete ", id)
  persons = persons.filter(person => person.id !== id);
  console.log(persons)
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("hello");
});
