// Script para gerar chaves VAPID para Web Push Notifications
// Execute: node scripts/generate-vapid-keys.js

const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('\n=== VAPID Keys Geradas ===\n');
console.log('Adicione estas variáveis ao seu arquivo .env:\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log('\nNOTA: Mantenha a chave privada segura e nunca a exponha publicamente!\n');
