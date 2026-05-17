const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

const genererCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const envoyerCodeConfirmation = async (email, nom, code) => {
  const options = {
    from: `🛵 Livraison App <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Code de confirmation — Livraison App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #FF6B35; padding: 20px; border-radius: 12px; text-align: center;">
          <h1 style="color: white; margin: 0;">🛵 Livraison App</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 12px; margin-top: 16px;">
          <h2 style="color: #1a1a2e;">Bonjour ${nom} !</h2>
          <p style="color: #666;">Merci de vous être inscrit sur Livraison App.</p>
          <p style="color: #666;">Voici votre code de confirmation :</p>
          <div style="background-color: #FF6B35; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <h1 style="color: white; font-size: 40px; letter-spacing: 8px; margin: 0;">${code}</h1>
          </div>
          <p style="color: #999; font-size: 13px;">Ce code expire dans 10 minutes.</p>
          <p style="color: #999; font-size: 13px;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(options);
};

const envoyerConfirmationPartenaire = async (email, nom) => {
  const options = {
    from: `🛵 Livraison App <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Inscription reçue — En attente de validation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #FF6B35; padding: 20px; border-radius: 12px; text-align: center;">
          <h1 style="color: white; margin: 0;">🛵 Livraison App</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 12px; margin-top: 16px;">
          <h2 style="color: #1a1a2e;">Bonjour ${nom} !</h2>
          <p style="color: #666;">Votre demande d'inscription a bien été reçue.</p>
          <p style="color: #666;">Notre équipe va vérifier vos documents et valider votre compte dans les <strong>24 à 48 heures</strong>.</p>
          <p style="color: #666;">Vous recevrez un email dès que votre compte sera validé.</p>
          <div style="background-color: #FFF3EE; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <p style="color: #FF6B35; margin: 0;">⏳ Statut : En attente de validation</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(options);
};

const envoyerValidationPartenaire = async (email, nom) => {
  const options = {
    from: `🛵 Livraison App <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '✅ Compte validé — Bienvenue sur Livraison App !',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2ecc71; padding: 20px; border-radius: 12px; text-align: center;">
          <h1 style="color: white; margin: 0;">✅ Compte Validé !</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 12px; margin-top: 16px;">
          <h2 style="color: #1a1a2e;">Félicitations ${nom} !</h2>
          <p style="color: #666;">Votre compte partenaire a été validé avec succès.</p>
          <p style="color: #666;">Vous pouvez maintenant vous connecter et commencer à recevoir des commandes !</p>
          <div style="background-color: #e8f5e9; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <p style="color: #2ecc71; margin: 0;">🎉 Statut : Compte actif</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(options);
};

module.exports = { genererCode, envoyerCodeConfirmation, envoyerConfirmationPartenaire, envoyerValidationPartenaire };