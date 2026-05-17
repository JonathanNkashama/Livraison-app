const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const socketIO = require('./socket/index');
socketIO.init(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/partenaires', require('./routes/partners'));
app.use('/api/produits', require('./routes/products'));
app.use('/api/commandes', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.json({ message: '🚀 API Delivery App en ligne' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📡 Socket.io actif`);
});