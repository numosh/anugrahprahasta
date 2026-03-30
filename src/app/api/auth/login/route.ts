import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Validasi dengan Environment Variable ADMIN_PASSWORD
    const truePassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (password !== truePassword) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    // Jika password benar, buat JSON Web Token (JWT)
    const token = await encrypt({ isAdmin: true, timestamp: Date.now() });

    // Buat response success dan sematkan token ke cookie HttpOnly yang aman
    const response = NextResponse.json({ success: true, message: "Logged in securely." }, { status: 200 });
    
    response.cookies.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
    
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
