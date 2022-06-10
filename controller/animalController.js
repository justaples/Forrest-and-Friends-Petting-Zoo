const Animal = require('../models/animals')
const multer = require('multer')
const path = require('path');
const { is } = require('express/lib/request');


const getAllAnimals = (req,res) =>{
    Animal.find({}, (err, animals)=>{
        if(err){
            res.status(400).json(err)
            return
        }
        res.render('animals/allAnimals', {animals})
    })
}

const newAnimal = (req,res) =>{
    res.render('animals/newAnimal')
}
// multer references - https://www.youtube.com/watch?v=9Qzmri1WaaE
// https://www.youtube.com/watch?v=sUUgbcHm_3c
// https://www.youtube.com/watch?v=nvSVZW2x8BQ&t=876s
// https://www.youtube.com/watch?v=nvSVZW2x8BQ
 
const storage = multer.diskStorage({
    destination:'./public',
    filename: function(req, file, cb){
        console.log(file.originalname)
        cb(null, Date.now() + file.originalname)
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
    }).single('img')

function checkFileType(file, cb){
    const fileTypes = /jpeg|jpg|png|gif/
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = fileTypes.test(file.mimetype)

    if (mimeType && extName){
        return cb(null, true)
    } else {
        cb('Error: Images only')
    }
}

const createAnimal = (req,res) =>{
    upload(req,res,(err)=>{
        if(err){
            res.render('animals/newAnimal',{
                msg:err
            })
        }else{
            if(req.file == undefined){
                res.render('animals/newAnimal',{
                    msg: 'Please select a file!'
                })
            }
        }
        try{
            let newAnimal = new Animal({
                name: req.body.name,
                age: req.body.age,
                img: req.file.filename,
            })
            newAnimal.save(() => res.redirect('/animals'))
            console.log(newAnimal)
        } catch (err){
            console.log(err)
        }
    })
}

const showAnimal = (req,res) =>{
    Animal.findById(req.params.animalId).then((a)=>{
        res.render('animals/showAnimal', {a})
    })
}

const editAnimal = (req,res) =>{
    Animal.findById(req.params.animalId, (err, a)=>{
        if(err){
            res.status(400).json(err)
            return
        }
        res.render('animals/editAnimal', {a: a, id:req.params.animalId})
    })
}

const updateAnimal = (req,res) =>{
    Animal.findByIdAndUpdate(req.params.animalId, req.body, {new:true}).then((a)=>{
        res.redirect(`/animals/${req.params.animalId}`)
    })
}

const deleteAnimal = (req,res) =>{
    Animal.findByIdAndDelete(req.params.animalId, (err, a)=>{
        if (err){
            res.status(400).json(err)
            return
        }
        res.redirect('/animals')
    })
}



module.exports = {
    getAllAnimals,
    newAnimal,
    createAnimal,
    showAnimal,
    editAnimal,
    updateAnimal,
    deleteAnimal
}