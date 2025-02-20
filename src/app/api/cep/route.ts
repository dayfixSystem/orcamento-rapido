import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cep = searchParams.get('cep');

  if (!cep) {
    return NextResponse.json({ error: 'CEP é obrigatório' }, { status: 400 });
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orcamento/cep/${cep}`, {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
  });

  return NextResponse.json(res.data);
}