import { NextRequest, NextResponse } from 'next/server';

/**
 * API para validar se o usuário tem acesso ao produto
 * Verifica se o e-mail fornecido tem uma compra aprovada
 */

// Armazenamento compartilhado de compras aprovadas
// Em produção, use um banco de dados real (Supabase, MongoDB, etc)
const comprasAprovadas = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório' },
        { status: 400 }
      );
    }

    const emailNormalizado = email.toLowerCase().trim();

    // Verificar se o e-mail tem compra aprovada
    const temAcesso = comprasAprovadas.has(emailNormalizado);

    console.log('🔍 Validação de acesso:', {
      email: emailNormalizado,
      hasAccess: temAcesso,
      totalAprovados: comprasAprovadas.size,
    });

    return NextResponse.json({
      hasAccess: temAcesso,
      email: emailNormalizado,
    });

  } catch (error) {
    console.error('❌ Erro ao validar acesso:', error);
    return NextResponse.json(
      { error: 'Erro ao validar acesso' },
      { status: 500 }
    );
  }
}

// Função auxiliar para adicionar e-mail aprovado (chamada pelo webhook)
export function adicionarEmailAprovado(email: string) {
  const emailNormalizado = email.toLowerCase().trim();
  comprasAprovadas.add(emailNormalizado);
  console.log('✅ E-mail adicionado à lista de aprovados:', emailNormalizado);
}

// Função auxiliar para remover e-mail (em caso de reembolso)
export function removerEmailAprovado(email: string) {
  const emailNormalizado = email.toLowerCase().trim();
  comprasAprovadas.delete(emailNormalizado);
  console.log('⚠️ E-mail removido da lista de aprovados:', emailNormalizado);
}

// Função auxiliar para obter lista completa (debug)
export function getComprasAprovadas(): Set<string> {
  return comprasAprovadas;
}
