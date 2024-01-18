

const username = localStorage.getItem('name');
if (!username) {
  window.location.replace('/');
  throw new Error('Username is required');
}
const lblStatusOnline = document.querySelector('#status-online');
const lblStatusOffline = document.querySelector('#status-offline');
const usersULElement = document.querySelector('ul'); 
const form = document.querySelector('form');
const input = document.querySelector('input');
const chatElement = document.querySelector('#chat');
const renderUsers = (users) => {
  usersULElement.innerHTML = '';
  users.forEach((user) => {
    const liElement = document.createElement('li');
    liElement.innerText = user.name;
    usersULElement.appendChild(liElement);
  });
};
const socket = io({
  auth: {
    token: 'ABC-123',
    name: username,
  }
});

socket.on('connect', () => {
  lblStatusOnline.classList.remove('hidden');
  lblStatusOffline.classList.add('hidden');
})
socket.on('disconnect', () => {
  lblStatusOnline.classList.add('hidden');
  lblStatusOffline.classList.remove('hidden');
})
socket.on("message", message => {
  console.log(message);
});

socket.on('welcome-message', (message) => {
  console.log(message);
})
socket.on('on-clients—changed', (clients) => {
  renderUsers(clients);
});

form.addEventListener( 'submit', ( event ) => {
  event.preventDefault();
  const message = input.value; 
  input.value = '';
  socket.emit('send-message', message );
  console.log(message);
});



const renderMessage = (payload) => {
  console.log("renderMessage",payload);
  const { userId, message, name } = payload;
  const divElement = document.createElement('div');
  divElement.classList.add('message');
  if (userId !== socket.id) {
    divElement.classList.add('incoming');
  }
  divElement.innerHTML = `
   <small>${name}</small> 
   <p>${message}</p> `;

  chatElement.appendChild(divElement);
  // Scroll al final de los mensajes 
  chatElement.scrollTop = chatElement.scrollHeight;
};

socket.on('on-message', renderMessage);
