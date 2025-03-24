import forge from "node-forge";
import CryptoJS from "crypto-js";

const aesEncryptMessage = (message: string) => {
  const key = CryptoJS.lib.WordArray.random(32); // generate a ranodm AES key of 256 bytes
  const iv = CryptoJS.lib.WordArray.random(16); // generate a iv vector that adds randomness to the value
  const encryptedMessage = CryptoJS.AES.encrypt(message, key, {
    iv: iv,
  }).toString();

  return {
    encryptedMessage,
    key: key.toString(CryptoJS.enc.Base64),
    iv: iv.toString(CryptoJS.enc.Base64),
  };
};

const aesDecryptMessage = (cipherText: string, key: string, iv: string) => {
  // return them into bytes
  const keyParsedBase64 = CryptoJS.enc.Base64.parse(key); 
  const ivParsedBase64 = CryptoJS.enc.Base64.parse(iv);

  return CryptoJS.AES.decrypt(cipherText, keyParsedBase64, {
    iv: ivParsedBase64,
  }).toString(CryptoJS.enc.Utf8);
};

const rsaDecryptAesKey = (
  rsaEncryptedAesKey: string,
  privateRsaKey: string
): string => {
  const rsa = forge.pki.privateKeyFromPem(privateRsaKey);
  const decoded = forge.util.decode64(rsaEncryptedAesKey);
  return rsa.decrypt(decoded, "RSA-OAEP");
};

const rsaEncryptAesKey = (aesKey: string, rsaPublicKey: string): string => {
  const rsa = forge.pki.publicKeyFromPem(rsaPublicKey);
  return forge.util.encode64(rsa.encrypt(aesKey, "RSA-OAEP"));
};

const generateRSAKeyPair = () => {
  const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair({
    bits: 2048,
    e: 0x10001,
  });

  const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
  const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

  return { privateKey: privateKeyPem, publicKey: publicKeyPem };
};

export {
  generateRSAKeyPair,
  rsaDecryptAesKey,
  rsaEncryptAesKey,
  aesEncryptMessage,
  aesDecryptMessage,
};
