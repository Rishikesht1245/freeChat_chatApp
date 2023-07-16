

const form = document.getElementById('send-box');
const messageInput = document.getElementById('message-inp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('public/images/notification.mp3');

//creating connection with client and server
const socket = io();

// appending new messages and new user join notifications dynamically
const append = (message, position) => {
      const newMessage = document.createElement('div');
      newMessage.classList.add('message');
      newMessage.classList.add(position);
      newMessage.textContent = message;
      messageContainer.appendChild(newMessage);
      if(position != 'right'){
            audio.play();
      }
};


// connect event (default)
socket.on('connect', () => {
        const getUsername = new Promise(function(resolve) {
          Swal.fire({
            title: 'Enter your name to join free chat!',
            html:
              '<input type="text" id="username" class="swal2-input" placeholder="Username" required>',
            confirmButtonText: 'Join',
            preConfirm: function() {
              const username = Swal.getPopup().querySelector('#username').value;
              if(username == ''){
                  Swal.showValidationMessage('Please enter your username');
                  }else{
                        resolve(username); // Resolve the Promise with the entered username
                  }
            }
          });
        });
      
        getUsername.then(function(name) {
          Swal.fire({
            title: 'Welcome, ' + name + '!',
            icon: 'success'
          });
          //emitting event to server
          socket.emit('new-user-joined', name)
          
        });
});


// event received from server once user joined
socket.on('user-joined', name => {
      const message = `${name} joined the chat.`
      append(message, 'middle');
});


//emitting message to server
form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = messageInput.value;
      append(`You : ${message}`, 'right');
      socket.emit('send' , message);
      messageInput.value = '';

})


// receive event handler
socket.on('receive' , data => {
      append(`${data.name} : ${data.message}`);
});


//disconnect event handler
socket.on('left' , name => {
      append(`${name} left the chat.`, 'middle');
});


    


    

