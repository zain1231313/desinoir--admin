// import Cookies from 'js-cookie'
// import crypto from "crypto-js";


// export function storeToken(value: string, token: string) {

//     Cookies.set(value, token, {
//       // httpOnly: true,
//       // sameSite: 'strict',
//       // secure: true,
//       expires: 7
//     })
//   }
  
//   export function getToken(value: string) {
//     return Cookies.get(value)
//   }
  
  
//   const cookiesToClear = [
//     'AccessToken', 'Email','Name',
//   ];
//   export function clearAllCookies() {
//     cookiesToClear.forEach(cookieName => {
//       if (Cookies.get(cookieName)) {
//         Cookies.remove(cookieName, {
//           path: '/',
//           maxAge: 0,
//         });
//       }
//     });
//   }
  
//   export const Encrytion = (value: any) => {
  
//     const encryptedValue = crypto.AES.encrypt(
//       value,
//       "virtuenetz"
//     ).toString();
  
//     return encryptedValue
//   }
  
//   export const Decrytion = (value: any) => {
  
//     const decryptedValue = crypto.AES.decrypt(
//       value,
//       "virtuenetz"
//     ).toString(crypto.enc.Utf8)
  
//     return decryptedValue
//   }
  
  
//   const getAndDecryptCookie = (cookieName: string) => {
//     const encryptedValue = Cookies.get(cookieName);
//     if (encryptedValue) {
//       const decryptedValue = Decrytion(encryptedValue);
//       return decryptedValue;
//     }
//     return null;
//   };
  
//   export default getAndDecryptCookie;




  //////////////////////////////////



  import Cookies from 'js-cookie';
const cookiesToClear = [
  'AccessToken', 'Email','Name',
];
const secretKey = 'mySecretKey123'; // Define a secret key for encryption

// Simple XOR Encryption function
function xorEncryptDecrypt(value: string, key: string): string {
  let result = '';
  for (let i = 0; i < value.length; i++) {
    result += String.fromCharCode(
      value.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}

// Store cookies with custom encryption
export function storeCookies(value: string, token: string) {
  const encryptedValue = xorEncryptDecrypt(token, secretKey);
  
  Cookies.set(value, encryptedValue, {
    sameSite: 'strict',
    secure: true,
    expires: 7
  });
}

// Decrypt cookies
export const Decryption = (value: string) => {
  return xorEncryptDecrypt(value, secretKey);
}

// Get and decrypt cookie
export function getCookies(value: string) {
  const encryptedValue = Cookies.get(value);
  if (encryptedValue) {
    return xorEncryptDecrypt(encryptedValue, secretKey);
  }
  return null;
}

// Clear all cookies
export function clearAllCookies(): void {
  cookiesToClear.forEach(cookieName => {
    if (Cookies.get(cookieName)) {
      Cookies.remove(cookieName, {
        path: '/',
        maxAge: 0,
      });
    }
  });
}

// Get and decrypt a cookie
const getAndDecryptCookie = (cookieName: string) => {
  const encryptedValue = Cookies.get(cookieName);
  if (encryptedValue) {
    return xorEncryptDecrypt(encryptedValue, secretKey);
  }
  return null;
};

export default getAndDecryptCookie;