import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Menggunakan API Key dari environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Kirim email langsung ke numosh@gmail.com melalui Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>', // Menggunakan default sender dari resend
      to: 'numosh@gmail.com',
      subject: `Pesan Baru dari ${name} di Website Anda!`,
      text: `Anda mendapat pesan baru dari: ${name} (${email})\n\nPesan:\n${message}`,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ success: false, message: "Gagal mengirim pesan melalui Resend." }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Message dispatched to your email." 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Failed to parse contact request." 
    }, { status: 400 });
  }
}
