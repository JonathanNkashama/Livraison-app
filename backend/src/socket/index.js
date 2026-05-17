let io;

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('🔌 Nouvelle connexion socket:', socket.id);

      socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`📌 Socket rejoint: ${room}`);
      });

      socket.on('disconnect', () => {
        console.log('❌ Déconnexion socket:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io non initialisé');
    return io;
  }
};