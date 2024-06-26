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

/**
 * Start listening on the specified port.
 */
io.listen(port);

/**
 * Listen for incoming connections.
 */
io.on("connection", (socket) => {
  /**
   * Log the ID of the player connected.
   */
  console.log(
    "Player joined with ID",
    socket.id,
    ". There are " + io.engine.clientsCount + " players connected."
  );

  /**
   * Handle a player's movement.
   * Broadcast the transforms to other player.
   */
  socket.on("player-moving", (transforms) => {
    socket.broadcast.emit("player-moving", transforms);
  });

  /**
   * Handle a player's animation.
   * Broadcast the animation to other player.
   */
  socket.on('change-animation', (animation) => {
    socket.broadcast.emit('updates-animation', animation)
  })

  /**
   * Handle player disconnection.
   */
  socket.on("disconnect", () => {
    console.log(
      "Player disconnected with ID",
      socket.id,
      ". There are " + io.engine.clientsCount + " players connected"
    );
  });
});