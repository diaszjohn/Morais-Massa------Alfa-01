/* ==========================================================================
   REGRAS DE NEGÓCIO E FORMATAÇÃO — MORAIS & MASSA TORTERIA
   ========================================================================== */

const Regras = (() => {
  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function sanitizarTexto(str, maxLen = 120) {
    if (typeof str !== "string") return "";
    return str
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLen);
  }

  function verificarStatusLoja() {
    const hora = new Date().getHours();
    const aberta = hora >= LOJA_CONFIG.horaAbertura && hora < LOJA_CONFIG.horaFechamento;
    return {
      aberta,
      texto: aberta ? "Aberto agora • 08h às 22h" : "Fechado agora • Abre às 08h"
    };
  }

  function calcularResumo(subtotal, cidade) {
    const isParnaiba = cidade === LOJA_CONFIG.cidadePadrao;
    const frete = isParnaiba ? LOJA_CONFIG.taxaParnaiba : 0;
    const total = subtotal + frete;

    return {
      subtotalNumerico: subtotal,
      subtotalTexto: formatarMoeda(subtotal),
      freteNumerico: frete,
      freteTexto: isParnaiba ? formatarMoeda(LOJA_CONFIG.taxaParnaiba) : "A consultar",
      totalNumerico: total,
      totalTexto: isParnaiba ? formatarMoeda(total) : `${formatarMoeda(subtotal)} + frete`
    };
  }

  function gerarLinkWhatsApp(dados) {
    const {
      itens,
      subtotal,
      cidade,
      outraCidade,
      bairro,
      numero,
      rua,
      referencia,
      nomeCliente,
      formaPagamento,
      precisaTroco,
      valorTroco,
      observacoes
    } = dados;

    const cidadeFinal = cidade === "Outra" ? sanitizarTexto(outraCidade, 50) : cidade;
    const resumo = calcularResumo(subtotal, cidade);

    const itensLinhas = itens
      .map((item) => {
        const tipo = item.categoria === "encomenda" ? " [ENCOMENDA]" : "";
        return `• ${item.qtd}x ${item.nome}${tipo} — ${formatarMoeda(item.preco * item.qtd)}`;
      })
      .join("\n");

    let trocoLinha = "";
    if (formaPagamento === "Dinheiro") {
      if (precisaTroco === "sim") {
        trocoLinha = `\n• Troco para: ${sanitizarTexto(valorTroco, 30)}`;
      } else {
        trocoLinha = "\n• Troco: Não precisa";
      }
    }

    const temEncomenda = itens.some((i) => i.categoria === "encomenda");
    const avisoEncomenda = temEncomenda
      ? "\n\n⚠️ *Pedido contém item sob encomenda (1 dia de antecedência e pagamento antecipado).*"
      : "";

    const mensagem = [
      "🍰 *NOVO PEDIDO — MORAIS & MASSA TORTERIA*",
      "",
      "*Itens do Pedido:*",
      itensLinhas,
      "",
      "*Resumo:*",
      `• Subtotal: ${resumo.subtotalTexto}`,
      `• Entrega (${cidadeFinal}): ${resumo.freteTexto}`,
      `• *Total: ${resumo.totalTexto}*`,
      "",
      "*Dados para Delivery:*",
      `• Cliente: ${sanitizarTexto(nomeCliente, 80)}`,
      `• Endereço: ${sanitizarTexto(rua, 100)}, Nº ${sanitizarTexto(numero, 20)} — ${sanitizarTexto(bairro, 60)}`,
      `• Cidade: ${cidadeFinal}`,
      referencia ? `• Referência/Obs: ${sanitizarTexto(referencia, 120)}` : null,
      observacoes ? `• Observações do pedido: ${sanitizarTexto(observacoes, 150)}` : null,
      "",
      "*Pagamento:*",
      `• Forma: ${formaPagamento}${trocoLinha}`,
      avisoEncomenda
    ]
      .filter((l) => l !== null)
      .join("\n");

    return `https://wa.me/${LOJA_CONFIG.whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
  }

  return {
    formatarMoeda,
    sanitizarTexto,
    verificarStatusLoja,
    calcularResumo,
    gerarLinkWhatsApp
  };
})();