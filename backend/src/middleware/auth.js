const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès admin requis' });
    }
    next();
  });
};

const verifyPartner = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'partenaire' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès partenaire requis' });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin, verifyPartner };