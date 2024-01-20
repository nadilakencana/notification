import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors'; 


const app = express();
const server = createServer(app);

//app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
	
    next();
});
const io = new Server(server, {
  cors:{
    origin: "*",
    methods: ['*']
  }
});
const port = 3388;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/notification', (req, res) => {
  //console.log(req.query);
   res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
  
  socket.on('order-from-user', (msg) => {
        console.log('New order:', msg);
        
        io.emit('notif-server', 'admin new order');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
  console.log('server running at http://localhost:3388');
});
