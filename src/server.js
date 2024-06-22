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

        const knigth = "/assets/models/characters/caracterKnigth.glb";
        const robot = "/assets/models/characters/Robot.glb";

        if (!player) {
            players.push({
                id: socket.id,
                urlAvatar: io.engine.clientsCount === 1 ?
                knigth :
                robot,
                position: null,
                rotation: null,
                animation: "Idle",
            });
            socket.emit("players-connected", players);
        }
    });

    socket.on("player-moving", (transforms) => {
        socket.broadcast.emit("player-moving", transforms);
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