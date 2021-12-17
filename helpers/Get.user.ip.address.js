function ip(socket) {
  const cleintIp =
    socket.handshake.headers["x-real-ip"] ||
    socket.conn.remoteAddress.split(":")[3];

  return cleintIp;
}

module.exports = { ip: ip };
