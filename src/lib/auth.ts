import { SignJWT, jwtVerify } from "jose";

// Gunakan JWT_SECRET dari environment variable, atau fallback untuk local development.
const secretKey = process.env.JWT_SECRET_KEY || "TokoBagus2026_Secure_Key_Fallback_Dev";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Token aktif selama 24 jam
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
