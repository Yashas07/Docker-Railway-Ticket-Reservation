const express = require('express');
const app = express();
const path = require('path');
const db = require('./util/database');
const bodyparser = require('body-parser');
const session = require('express-session');




app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyparser.urlencoded({ extended : false }));
app.use(bodyparser.json());

app.use(express.static(__dirname + '/public'));

const trainRoutes = require('./routes/train');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/ticket');
const User = require('./models/user');

app.use(session({ secret : 'my secret', resave : false, saveUninitialized : false}));


app.use(authRoutes);
app.use(trainRoutes);
app.use(ticketRoutes);















// app.use((req,res,next) => {
//     console.log("There was an error! We're trying to fix it.");
//     //console.log(arr2);
//     res.render('err');
// })

User.sync()
.then(result => {
    console.log(result);
})
.catch(err => {
    console.log(err);
})

const PORT = process.env.PORT || 4000;
app.listen(PORT,() => {
    console.log('Server started');
});