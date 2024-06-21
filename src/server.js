"use strict";

const { Server } = require("socket.io");

const clientURLLocalhost = process.env.CLIENT_URL_LOCALHOST
const clientURLDeploy = process.env.CLIENT_URL_DEPLOY
const port = process.env.PORT

const io = new Server({
    cors: {
        origin: [clientURLLocalhost, clientURLDeploy]
    }
})

let players = [];

io.on("connection", (socket) => {
    console.log(
        'Player joined with ID' +
        socket.id +
        '. There are ' +
        io.engine.clientsCount +
        ' players connected'
    )

    socket.on('players-connected', ()=>{
        const player = players.find((player) => player.id === socket.id);

        if (!player) {
            players.push({
                id: socket.id,
                urlAvatar: "",
                position: null,
                rotation: null,
                animation: "Idle",
            });
            socket.emit("players-connected", players);
        }
    });

    socket.on('moving-player', (valuesTransformPlayer) => {
        const player = players.find(player => player.id === socket.id)

        player.position = valuesTransformPlayer.position;
        player.rotation = valuesTransformPlayer.rotation;

        socket.broadcast.emit('updates-values-transform-player', player)
    });

    socket.on("change-animation", (animation) => {
        const player = players.find(player => player.id === socket.id)
        player.animation = animation;
        socket.broadcast.emit("update-animation", player);
    })

    socket.on('disconnect', () => {
        console.log('Player disconnected with ID ' + socket.id)

        players = players.filter(player => player.id !== socket.id)
        socket.broadcast.emit('player-disconnected', socket.id)
    });
})

io.listen(port)