/**
 * Genera una cuenta SMTP de prueba en Ethereal (https://ethereal.email) e
 * imprime las lineas SMTP_* listas para pegar en el .env.
 *
 * Ethereal NO entrega los correos a nadie: los guarda en un buzon web y
 * nodemailer devuelve una URL para verlos. Ideal para la demo del examen.
 *
 * Uso:  npm run mail:setup
 */
const nodemailer = require('nodemailer');

nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('No se pudo crear la cuenta Ethereal:', err.message);
    process.exit(1);
  }

  console.log('\nCuenta Ethereal creada. Pega esto en tu .env:\n');
  console.log(`SMTP_HOST=${account.smtp.host}`);
  console.log(`SMTP_PORT=${account.smtp.port}`);
  console.log(`SMTP_SECURE=${account.smtp.secure}`);
  console.log(`SMTP_USER=${account.user}`);
  console.log(`SMTP_PASS=${account.pass}`);
  console.log(`\nBuzon web: https://ethereal.email/login  (usuario y contrasena de arriba)\n`);
});
