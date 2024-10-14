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