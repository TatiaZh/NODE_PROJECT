const express = require('express');
const path = require('path');
const app = express();

const usersController = require('./routes/usersController');
const usersControllerRouter = usersController.router;
const carsController = require('./routes/carsController');
const carsControllerRouter = carsController.router;
const configurationController = require('./routes/configurationController');

const PORT = process.env.PORT || 3000;

app.set('views', './src/views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

app.use(usersControllerRouter);
app.use(carsControllerRouter);
app.use(configurationController);

app.get('/', (req, res) => {
    res.render('index', { title: "Welcome" });
});

app.listen(PORT, () => {
    console.log(`Started at port ${PORT}`)
})



