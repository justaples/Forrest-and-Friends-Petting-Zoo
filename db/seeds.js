require('dotenv').config();
require('./connection');

const Animal = require('../models/animals');
const animalSeeds =  require('./seeds.json')

Animal.deleteMany({}) 
.then(async ()=>{
    return await Animal.insertMany(animalSeeds)
}).then(console.log)
.catch(err =>{
    console.log(err)
})
    .finally(()=>{
    process.exit()
})