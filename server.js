const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use("/", express.static("public"));

//=============DATETIME=================================
const date = require("date-and-time");
const now = new Date();
const saveDate = date.format(now, "YYYY/MM/DD HH:mm:ss");

//=================CONFIG DOTENV======================================
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
//============CONTROLLERS=======================================================
const { ip } = require("./helpers/Get.user.ip.address");
//==============================================================================

io.on("connection", (socket) => {
  console.log("my socket id", socket.id);
  // ========================================================
  // ip address
  var ipAddress = ip(socket);
  console.log("ip address ", ipAddress);

  socket.on("join", (roomId) => {
    const roomClients = io.sockets.adapter.rooms[roomId] || { length: 0 };
    const numberOfClients = roomClients.length;

    // These events are emitted only to the sender socket.

    if (numberOfClients === 0) {
      console.log(
        `creating room ${roomId} and emitting room_created socket event`
      );
      socket.join(roomId);
      socket.emit("room_created", roomId);
    } else if (numberOfClients === 1) {
      console.log(
        `Joining room ${roomId} and emitting room_joined socket event`
      );

      socket.join(roomId);
      socket.emit("room_joined", roomId);
    } else if (numberOfClients === 2) {
      console.log(
        `Joining room ${roomId} and emitting room_joined socket event`
      );

      socket.join(roomId);
      socket.emit("room_joined", roomId);
    } else {
      console.log(`Can't join room ${roomId},emitting full_room socket event`);
      socket.emit("full_room", roomId);
    }
  });

  // These events are emitted to all the sockets connected to the same room except the sender.
  socket.on("start_call", (roomId) => {
    console.log(`Broadcasting start_call event to peers in room ${roomId}`);

    startCall(socket, saveDate, roomId, ipAddress);
  });

  socket.on("webrtc_offer", (event) => {
    console.log(
      `Broadcasting webrtc_offer event to peers in room ${event.roomId}`
    );
    socket.broadcast.to(event.roomId).emit("webrtc_offer", event.sdp);
  });

  socket.on("webrtc_answer", (event) => {
    console.log(
      `Broadcasting webrtc_answer event to peers in room ${event.roomId}`
    );

    socket.broadcast.to(event.roomId).emit("webrtc_answer", event.sdp);
  });

  socket.on("webrtc_ice_candidate", (event) => {
    console.log(
      `Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`
    );
    socket.broadcast.to(event.roomId).emit("webrtc_ice_candidate", event);
  });

  // diconnect user
  socket.on("disconnect", () => {
    console.log("user disconnect ", users[socket.id]);
    disconnect(socket, users[socket.id]);
  });
});

// START THE SERVER ==========================================================
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Express server listen on port ${port}  👂`);
});
