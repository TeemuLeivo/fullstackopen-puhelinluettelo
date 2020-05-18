const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
  const password = process.argv[2]
  
  const url = `mongodb+srv://fullstack:${password}@cluster0-ez4lh.mongodb.net/phonebook-app?retryWrites=true&w=majority`

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  const personSchema = new mongoose.Schema({
      id: Number,
      name: String,
      number: String
  })
  const Person = mongoose.model('Person', personSchema)

  if(process.argv.length === 3){
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
  }
  else {
      const newName = process.argv[3]
      const newNumber = process.argv[4]
      const randomId = Math.floor(Math.random() * 10000000);
      const person = new Person({
        id: randomId,
        name: newName,
        number: newNumber
    })
  
    person.save().then(response => {
      console.log('note saved!')
      mongoose.connection.close()
    })
  }
 

  