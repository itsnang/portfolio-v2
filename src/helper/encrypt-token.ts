import { AES, enc } from "crypto-js";
const key = process.env.ENCRYPTION_KEY;

const encryptCookie = (data: string): string => {
  try {
    const encryptValue = AES.encrypt(data, key ?? "").toString();
    return encryptValue;
  } catch (error) {
    console.log(error);
    return "";
  }
};

const decryptCookie = (data: string): string => {
  try {
    const bytes = AES.decrypt(data, key ?? "");

    const decryptedData = bytes.toString(enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.log("error", error);
    return "";
  }
};

export { encryptCookie, decryptCookie };
