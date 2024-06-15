"use strict";

const { Server } = require("socket.io");

const clientUrl = "http://localhost:3000";
const port = 5000;

const io = new Server({
    cors: {
        origin: clientUrl
    }
})

let players = []

io.on("connection", (socket) => {
    console.log(
        'Player joined with ID' +
        socket.id +
        '. There are ' +
        io.engine.clientsCount +
        ' players connected'
    )

    socket.on('player-connected', ()=>{
        players.push({
            id: socket.id,
            urlAvatar: '',
            position: null,
            rotation: null,
            animation: 'Idle',
        })
        socket.emit('player-connected', players)
    })
})

io.listen(port)