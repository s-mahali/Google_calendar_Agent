import crypto from "crypto";

export function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  const payload = iv.toString("hex") + ":" + encrypted + ":" + authTag;
  return payload;
}

export function decrypt(text: string, key: string): string {
  const [ivHex, encryptedHex, authTagHex] = text.split(":");
  if (!ivHex || !encryptedHex || !authTagHex) {
    throw new Error("Invalid payload format; expected iv:ciphertext:authTag");
  }
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
