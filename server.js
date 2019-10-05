const express = require('express');
const app = express();
const mongoose = require('mongoose');
const database = require('./config/keys').mongoURL;
const PORT = process.env.PORT || 5000;
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');




mongoose.connect(database)
    .then(() => console.log("connected to DB Success"))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('hello'))

//app.use();
//app.use(bodyParser.json());
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);


app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))