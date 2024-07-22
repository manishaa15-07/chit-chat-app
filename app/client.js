const socket=io('http://localhost:8000');
console.log('Client script loaded and socket.io initialized');

const form=document.getElementById('send-msg');
const msginput=document.getElementById('messageinput');
const msgop=document.querySelector('.container');
var audio=new Audio('notify.mp3');
const append=(message,position)=>{
    console.log("appended!!");
    const msgelement=document.createElement('div');
    msgelement.innerHTML=message;
    msgelement.classList.add('msg');
    msgelement.classList.add(position);
    msgop.append(msgelement);
    if(position=='left'){
        audio.play();
    }
   
}
 const name=prompt("Enter your name");
console.log('Emitting user-joined event with name:', name);
socket.emit('user-joined',name);
socket.on('user-joined', name=>{
    console.log('Received user-joined event with name:', name);
    append(`${name} joined the chat`,'right');
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = msginput.value;
    append(`You: ${message}`,'right');
    console.log('Emitting send event with message:', message);
    socket.emit('send', message);
    msginput.value = '';
});
socket.on("receive",data => {
    append(`${data.name}: ${data.message}`,'left');
});
socket.on('leave',name=>{
    append(`${name} left the chat `,'right');
})