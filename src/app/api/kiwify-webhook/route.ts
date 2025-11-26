import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface KiwifyWebhookPayload {
  order_id?: string;
  order_status?: string;
  product_id?: string;
  customer_email?: string;
  customer_name?: string;
  approved_date?: string;
  // o payload de teste pode ter outras chaves
  [key: string]: any;
}

// Armazenamento temporário de e-mails aprovados (em produção, use banco de dados)
const comprasAprovadas = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as KiwifyWebhookPayload;

    // -----------------------------
    // 1) VALIDAÇÃO OPCIONAL DE ASSINATURA
    // -----------------------------
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

    // -----------------------------
    // 2) LOG DO EVENTO RECEBIDO
    // -----------------------------
    console.log("📩 Webhook Kiwify recebido (bruto):", body);

    // Alguns webhooks de teste da Kiwify podem usar outros campos de email.
    const emailRaw =
      body.customer_email ||
      body.email ||
      body.buyer_email ||
      (body.customer && body.customer.email) ||
      "";

    if (!emailRaw) {
      // Não vamos quebrar se o teste não mandar e-mail
      console.log(
        "ℹ️ Webhook de teste sem e-mail no payload. Nada para salvar como compra aprovada."
      );
      return NextResponse.json({
        success: true,
        message: "Webhook recebido (sem email no payload de teste).",
        status: body.order_status ?? "unknown",
      });
    }

    const email = emailRaw.toLowerCase().trim();
    const status = (body.order_status || "").toLowerCase();

    console.log("📩 Processando evento:", {
      order_id: body.order_id,
      status: status,
      email,
      name: body.customer_name,
    });

    // -----------------------------
    // 3) COMPRA APROVADA
    // -----------------------------
    if (status === "paid" || status === "approved" || status === "compra_aprovada") {
      comprasAprovadas.add(email);

      console.log("✅ Compra aprovada e acesso liberado:", email);
      console.log("📊 Total de compras aprovadas:", comprasAprovadas.size);

      return NextResponse.json({
        success: true,
        message: "Compra processada e acesso liberado com sucesso",
        order_id: body.order_id,
        email,
      });
    }

    // -----------------------------
    // 4) REEMBOLSO / CANCELAMENTO
    // -----------------------------
    if (
      status === "refunded" ||
      status === "cancelled" ||
      status === "reembolso" ||
      status === "compra_cancelada"
    ) {
      comprasAprovadas.delete(email);

      console.log("⚠️ Acesso removido (reembolso/cancelamento):", email);

      return NextResponse.json({
        success: true,
        message: "Acesso removido",
        order_id: body.order_id,
      });
    }

    // -----------------------------
    // 5) OUTROS STATUS
    // -----------------------------
    console.log("ℹ️ Status recebido (sem ação especial):", status);
    return NextResponse.json({
      success: true,
      message: "Webhook recebido",
      status,
      email,
    });
  } catch (error) {
    console.error("❌ Erro ao processar webhook Kiwify:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook Kiwify" },
      { status: 500 }
    );
  }
}
