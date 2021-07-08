const path =  require('path');

// Initialize the express application 
const express = require('express');

// Start the body parser 
const bodyParser = require('body-parser');

// DB connection  to monngodb
const  mongoose = require('mongoose');

const multer = require('multer');

// Configure the routes 
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');



// Start  thee express application
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => { 
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb)  => { 
    if  (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);   
    } else { 
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

// This deals with the  CORS errors  and  gives permissions to the sytem for cross shared resources
// Allows  clients to communicate with the server 
app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
    'Access-Control-Allow-Methods', 
    'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed',  feedRoutes);
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

mongoose.connect('mongodb+srv://juansuarez:Ginger12ale@cluster0.sz8my.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(result => { 
    const server = app.listen(8080, () => { 
        const { address, port } = server.address();
        console.log(`Listening at http://${address}:${port}`);
      });
})
.catch(err => console.log(err));



