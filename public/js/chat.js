

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


