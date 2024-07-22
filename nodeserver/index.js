// this is a node server handle socket io connections//
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.io server');
});

// Configure CORS for the HTTP server (optional if you are serving HTTP requests)
const app = require('express')();
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Attach HTTP server to the Express app
server.on('request', app);

// Create Socket.IO server with CORS configuration
const io = socketIo(server, {
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});
const users={}
io.on('connection',socket=>{
    console.log('A user connected:', socket.id);

    socket.on('user-joined',name=>{
        console.log("new user joined",name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    })

    socket.on('send',(message)=>{
        console.log('Message received:', message);
        socket.broadcast.emit("receive",{message:message , name:users[socket.id]})
    })
    socket.on('disconnect',message=>{
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    })
    
})
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
