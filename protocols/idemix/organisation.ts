import { Utils } from 'fabric-common';
// import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';

function privateKeyToPEM(privateKeyBytes) {
    const base64 = Buffer.from(privateKeyBytes).toString('base64');
    const pem = '-----BEGIN PRIVATE KEY-----\n' +
                base64.match(/.{1,64}/g)!.join('\n') +
                '\n-----END PRIVATE KEY-----\n';
    return pem;
}

function publicKeyToPEM(publicKeyBytes) {
    const base64 = Buffer.from(publicKeyBytes).toString('base64');
    const pem = '-----BEGIN PUBLIC KEY-----\n' +
                base64.match(/.{1,64}/g)!.join('\n') +
                '\n-----END PUBLIC KEY-----\n';
    return pem;
}

async function generateIdemixKeys() {
    try {
        // Set up the crypto suite
        const cryptoSuite = Utils.newCryptoSuite({ algorithm: 'ECDSA' });
        // await cryptoSuite.init();

        // Generate idemix issuer key
        const key = await cryptoSuite.generateKey({ ephemeral: true });

        // Extract the private and public key components
        const privateKey = key.toBytes();
        const publicKey = key.getPublicKey().toBytes();

        // Convert keys to PEM format
        const privateKeyPEM = privateKeyToPEM(privateKey);
        const publicKeyPEM = publicKeyToPEM(publicKey);

        console.log('Idemix Issuer Private Key:');
        console.log(privateKeyPEM);
        console.log('\nIdemix Issuer Public Key:');
        console.log(publicKeyPEM);

        // Save keys to files
        fs.writeFileSync('idemix_private_key.pem', privateKeyPEM);
        fs.writeFileSync('idemix_public_key.pem', publicKeyPEM);

        console.log('\nKeys have been saved to idemix_private_key.pem and idemix_public_key.pem');
    } catch (error) {
        console.error('Error generating idemix keys:', error);
    }
}

generateIdemixKeys();
