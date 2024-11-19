const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const PORT = 9000;
require("dotenv").config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'workout-schedule';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(client => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
});

app.get('/', (request, response) => {
    db.collection('workouts').find().sort({'completed': 1, '_id': -1}).toArray()
        .then(data => {
            response.render('index.ejs', { info: data });
        })
        .catch(error => console.error(error));
});

app.post('/addWorkout', (request, response) => {
    db.collection('workouts').insertOne({
        exercise: request.body.exercise,
        sets: request.body.sets,
        reps: request.body.reps,
        completed: false
    })
    .then(result => {
        console.log('Workout Added');
        response.redirect('/');
    })
    .catch(error => console.error(error));
});

app.put('/toggleComplete', (request, response) => {
    db.collection('workouts').findOneAndUpdate({
        exercise: request.body.exercise,
        sets: request.body.sets,
        reps: request.body.reps
    }, {
        $set: {
            completed: request.body.completed
        }
    })
    .then(result => {
        console.log('Toggled completion status');
        response.json('Status Updated');
    })
    .catch(error => console.error(error));
});

app.delete('/deleteWorkout', (request, response) => {
    db.collection('workouts').findOneAndDelete({
        exercise: request.body.exercise,
        sets: request.body.sets,
        reps: request.body.reps
    })
    .then(result => {
        console.log('Workout Deleted');
        response.json('Workout Deleted');
    })
    .catch(error => console.error(error));
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
});