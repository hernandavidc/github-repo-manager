import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }
    
    // Guardar el email en una cookie
    const cookieStore = cookies();
    (await cookieStore).set('github_connect_email', email, { 
      maxAge: 60 * 5,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al preparar la conexión con GitHub:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}