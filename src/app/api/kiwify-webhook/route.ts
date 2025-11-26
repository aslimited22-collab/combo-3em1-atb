import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface KiwifyWebhookPayload {
  order_id: string;
  order_status: string;
  product_id: string;
  customer_email: string;
  customer_name: string;
  approved_date?: string;
  [key: string]: any;
}

// Armazenamento temporário de e-mails aprovados (em produção, use banco de dados)
const comprasAprovadas = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as KiwifyWebhookPayload;

    // Validar assinatura do webhook (segurança)
    const signature = request.headers.get("x-kiwify-signature");
    const webhookSecret = process.env.KIWIFY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(body))
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("❌ Assinatura inválida do webhook Kiwify");
        return NextResponse.json(
          { error: "Assinatura inválida" },
          { status: 401 }
        );
      }
    }

    // Log do evento recebido
    console.log("📩 Webhook Kiwify recebido:", {
      order_id: body.order_id,
      status: body.order_status,
      email: body.customer_email,
      name: body.customer_name,
    });

    // Processar apenas compras aprovadas
    if (body.order_status === "paid" || body.order_status === "approved") {
      const email = body.customer_email.toLowerCase();

      // Adicionar e-mail à lista de aprovados
      comprasAprovadas.add(email);

      console.log("✅ Compra aprovada e acesso liberado:", email);
      console.log("📊 Total de compras aprovadas:", comprasAprovadas.size);

      // Aqui você pode expandir para:
      // 1. Salvar em banco de dados (Supabase, etc.)
      // 2. Enviar e-mail de boas-vindas
      // 3. Integrar com sistema de membros, etc.

      return NextResponse.json({
        success: true,
        message: "Compra processada e acesso liberado com sucesso",
        order_id: body.order_id,
        email,
      });
    }

    // Processar reembolsos/cancelamentos
    if (body.order_status === "refunded" || body.order_status === "cancelled") {
      const email = body.customer_email.toLowerCase();
      comprasAprovadas.delete(email);

      console.log("⚠️ Acesso removido (reembolso/cancelamento):", email);

      return NextResponse.json({
        success: true,
        message: "Acesso removido",
        order_id: body.order_id,
      });
    }

    // Outros status (pendente, etc)
    console.log("ℹ️ Status recebido:", body.order_status);
    return NextResponse.json({
      success: true,
      message: "Webhook recebido",
      status: body.order_status,
    });
  } catch (error) {
    console.error("❌ Erro ao processar webhook Kiwify:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
