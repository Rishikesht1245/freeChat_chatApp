const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// serving static files 
app.use('/public', express.static(path.join(__dirname, 'public')));

// setting view engine to ejs
app.set('view engine', 'ejs');

// rendering the index page
app.get('/', (req, res) => {
  res.render('index');
});

const users = {};

// connection event (default)
io.on('connection', (socket) => {
      
      // when new user joined
      socket.on('new-user-joined', (name) => {
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', name);
      });

      // new message send by the user
      socket.on('send', (message) => {
      // broadcast will emit the message to all other users.
      socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
      });

      // disconnect event when user close the app
      socket.on('disconnect', message => {
            socket.broadcast.emit('left', users[socket.id]);
      });
});


const port = 8000;
http.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
