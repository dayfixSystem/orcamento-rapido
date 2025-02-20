import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orcamento/marcas`, {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
    });
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar marcas' }, { status: 500 });
  }
}
