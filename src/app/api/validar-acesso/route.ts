import { NextRequest, NextResponse } from "next/server";

interface ValidarAcessoPayload {
  email?: string;
  produtoId?: string;
}

/**
 * Rota de validação de acesso.
 * Por enquanto está simplificada: sempre libera o acesso
 * se receber um e-mail válido no corpo da requisição.
 *
 * Depois você pode trocar a lógica interna para checar
 * no Supabase ou na Kiwify.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ValidarAcessoPayload;

    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          allowed: false,
          message: "E-mail é obrigatório para validar o acesso.",
        },
        { status: 400 }
      );
    }

    // TODO: aqui você pode implementar a lógica real de validação,
    // por exemplo:
    // - consultar Supabase
    // - verificar se o e-mail está em uma tabela de compras aprovadas
    // - checar produtoId, etc.

    // Por enquanto, apenas libera o acesso se o e-mail foi enviado.
    return NextResponse.json({
      success: true,
      allowed: true,
      message: "Acesso liberado (validação simples ativa).",
      email,
    });
  } catch (error) {
    console.error("❌ Erro ao validar acesso:", error);
    return NextResponse.json(
      {
        success: false,
        allowed: false,
        message: "Erro interno ao validar acesso.",
      },
      { status: 500 }
    );
  }
}
