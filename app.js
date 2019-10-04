const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Recipe = require('./models/recipe')

const bodyParser = require('body-parser')
app.use(bodyParser.json())

//MongoDB Connection
mongoose.connect('mongodb+srv://demola:demola@cluster0-qtpbo.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas");
    })
    .catch((error) => {
        console.log("Unabble to Connect to Atlas");
        console.error(error);
    })

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//adds a new recipe to the database
app.post('/api/recipes', (req, res, next) => {

    //destructuring req.body
    const { title, ingredients, instructions, time, difficulty } = req.body
    const recipe = new Recipe({
        title,
        ingredients,
        instructions,
        time,
        difficulty
    })
    recipe.save().then(() => {
        res.status(201).json({
            message: "Recipe saved successfully"
        })
    }).catch((error) => {
        res.status(400).json({
            error: error
        })
    })
})

// returns the recipe with the provided ID from the database
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({ _id: req.params.id }).then((recipe) => {
        res.status(200).json(recipe)
    }).catch((error) => {
        res.status(404).json({
            error: error
        })
    })
})

//modifies the recipe with the provided ID
app.put('/api/recipes/:id', (req, res, next) => {
    //destructuring req.body
    const { title, ingredient, instructions, time, difficulty } = req.body
    const recipe = new Recipe({
        _id: req.params.id,
        title,
        ingredient,
        instructions,
        time,
        difficulty
    })
    Recipe.updateOne({ _id: req.params.id }, recipe).then(() => {
        res.status(201).json({
            message: "Recipe updated Successfully"
        }).catch((error) => {
            res.status(400).json({
                error: error
            })
        })
    })
})

//deletes the recipe with the provided ID
app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({ _id: req.params.id }).then(() => {
        res.status(200).json({
            message: 'Recipe deleted successfully'
        }).catch((error) => {
            res.status(400).json({
                error: error
            })
        })
    })
})

//returns all recipes in database
app.get('/api/recipes', (req, res, next) => {
    Recipe.find().then((recipes) => {
        res.status(200).json(recipes)
    }).catch((error) => {
        res.status(400).json({
            error: error
        })
    })
})

module.exports = app;

