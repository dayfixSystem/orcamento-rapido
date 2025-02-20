import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, body, {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Erro ao cadastrar cliente' },
      { status: error.response?.status || 500 }
    );
  }
}
