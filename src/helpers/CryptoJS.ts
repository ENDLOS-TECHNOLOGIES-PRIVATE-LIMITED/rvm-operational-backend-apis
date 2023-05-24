// import CryptoJS from 'crypto-js';
// import { parse } from 'path';

// const Encript = (plainData: any) => {
//   if (parseInt(process.env.encryption) == 0) {
//     return plainData;
//   }
//   let randomIV = randomString(16);

//   let key = CryptoJS.enc.Utf8.parse('$P@mOu$0172@0r!P');

//   let iv = CryptoJS.enc.Utf8.parse(randomIV);

//   let encripted = CryptoJS.AES.encrypt(JSON.stringify(plainData), key, {
//     keySize: 128 / 8,
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   encripted = encripted.toString() + randomIV;

//   return encripted.replace(/\\/g, '/');
// };

// const Decrypt = (cipherData: any) => {
//   if (parseInt(process.env.encryption) == 0) {
//     // console.log(cipherData);
//     if (typeof cipherData == 'string') {
//       return JSON.parse(cipherData);
//     } else {
//       return cipherData;
//     }
//   }
//   var key = CryptoJS.enc.Utf8.parse('$P@mOu$0172@0r!P');

//   var iv = CryptoJS.enc.Utf8.parse(cipherData.slice(cipherData.length - 16));

//   cipherData = cipherData.slice(0, cipherData.length - 16);
//   var decrypted = CryptoJS.AES.decrypt(cipherData, key, {
//     keySize: 128 / 8,

//     iv: iv,

//     mode: CryptoJS.mode.CBC,

//     padding: CryptoJS.pad.Pkcs7,
//   });

//   let Jsondata = JSON.parse(JSON.parse(` ${decrypted.toString(CryptoJS.enc.Utf8)}`));

//   return Jsondata;
// };

// const randomString = length => {
//   let text = '';
//   let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }

//   return text;
// };

// export { Encript, Decrypt };
