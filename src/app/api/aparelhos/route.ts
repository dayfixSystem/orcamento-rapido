import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const marca = searchParams.get('marca');

  if (!marca) {
    return NextResponse.json({ error: 'Marca é obrigatória' }, { status: 400 });
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orcamento/aparelhos`, {
    params: { marca },
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
  });

  return NextResponse.json(res.data);
}