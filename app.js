const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const ip = require('ip');
const publicIp = require('public-ip');
const MachineUUID = require('machine-uuid');
const nodeID = require('node-machine-id');
const platform = require('platform');


// Connect To Database
mongoose.connect(config.database);
mongoose.Promise = Promise;

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

const app = express();

const users = require('./routes/users');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join('D:/project/myapp/src/src/assets')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', users);

// Index Route
app.get('/', (req, res) => {
    res.render('frontend/index');
});

// Start Server
app.listen(port, () => {

    console.log('1', nodeID.machineIdSync({ original: true }));
    MachineUUID((uuid) => {
        console.log('3', uuid);
    });
    console.log('Server started on port ' + port);
    //a17a5b73-5c6d-4c4b-90e8-d26bb197e710
    console.log('plaform: ', platform.os);
});
