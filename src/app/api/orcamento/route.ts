import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { reparos, aparelho, bairro, cidade, cep } = body;

    if (!reparos || !aparelho || !bairro || !cidade || !cep) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/orcamento/gerar`,
      { reparos, aparelho, bairro, cidade, cep },
      {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` },
      }
    );

    // Retornar a resposta da API para o frontend
    return NextResponse.json(res.data);
  } catch (error: any) {
    // Tratar erros de regra de negócio (ex.: nenhum peça encontrada)
    if (error.response) {
      return NextResponse.json(
        {
          error: error.response.data.message || 'Erro na geração do orçamento.',
        },
        { status: error.response.status || 500 }
      );
    }

    // Tratar erros inesperados
    return NextResponse.json(
      { error: 'Erro inesperado ao gerar orçamento.' },
      { status: 500 }
    );
  }
}
