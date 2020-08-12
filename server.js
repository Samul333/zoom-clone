const express = require('express')
const app = express();
const {v4: uuidv4} = require('uuid')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {ExpressPeerServer} = require('peer')
const PeerServer = ExpressPeerServer(server,{
    debug:true
})
app.use(express.static('public'));

app.set('view engine', 'ejs');


app.use('/peerjs', PeerServer);
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket =>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId)
    })
})


server.listen(3030);