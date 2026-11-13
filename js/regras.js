/* ==========================================================================
   REGRAS DE NEGÓCIO, FORMATAÇÃO E INTEGRAÇÃO WHATSAPP
   ========================================================================== */

const Regras = {
  formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  },

  verificarStatusLoja() {
    const agora = new Date();
    const horaAtual = agora.getHours();
    const aberta =
      horaAtual >= LOJA_CONFIG.horarioAbertura &&
      horaAtual < LOJA_CONFIG.horarioFechamento;

    return {
      aberta,
      texto: aberta
        ? "Aberto agora • 08h às 22h"
        : "Fechado • Aceitando encomendas"
    };
  },

  calcularFrete(cidadeSelecionada) {
    if (cidadeSelecionada === "Parnaíba") {
      return {
        valor: LOJA_CONFIG.taxaParnaiba,
        texto: this.formatarMoeda(LOJA_CONFIG.taxaParnaiba),
        fixo: true
      };
    }

    return {
      valor: 0,
      texto: "A consultar",
      fixo: false
    };
  },

  calcularResumo(subtotal, cidadeSelecionada) {
    const frete = this.calcularFrete(cidadeSelecionada);
    const totalNumerico = subtotal + frete.valor;

    return {
      subtotalTexto: this.formatarMoeda(subtotal),
      freteTexto: frete.texto,
      totalNumerico,
      totalTexto: frete.fixo
        ? this.formatarMoeda(totalNumerico)
        : `${this.formatarMoeda(subtotal)} + frete`
    };
  },

  gerarLinkWhatsApp(dadosPedido) {
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
    } = dadosPedido;

    const temEncomenda = itens.some((item) => item.categoria === "encomenda");
    const resumo = this.calcularResumo(subtotal, cidade);
    const destinoTexto =
      cidade === "Parnaíba"
        ? "Parnaíba (PHB)"
        : `${outraCidade.trim()} (Outra cidade/região)`;

    const listaItensTexto = itens
      .map(
        (item) =>
          `• ${item.qtd}x ${item.nome} (${item.unidade}) — ${this.formatarMoeda(
            item.preco * item.qtd
          )}`
      )
      .join("\n");

    let pagamentoTexto = `💳 *Pagamento:* ${formaPagamento}`;
    if (formaPagamento === "Dinheiro") {
      if (precisaTroco === "sim") {
        const valorFormatado = this.formatarMoeda(Number(valorTroco));
        pagamentoTexto += ` (Troco para ${valorFormatado})`;
      } else {
        pagamentoTexto += " (Não precisa de troco)";
      }
    }

    const avisoEncomenda = temEncomenda
      ? "\n⚠️ *ATENÇÃO:* Pedido contém *Torta Inteira sob encomenda* (1 dia de antecedência + pagamento antecipado).\n"
      : "";

    const obsTexto = observacoes.trim()
      ? `\n📝 *Observações:* ${observacoes.trim()}`
      : "";

    const mensagem = `*NOVO PEDIDO — MORAIS & MASSA TORTERIA* 🍰
${avisoEncomenda}
*Itens do Pedido:*
${listaItensTexto}

*Resumo de Valores:*
Subtotal: ${resumo.subtotalTexto}
Entrega (${destinoTexto}): ${resumo.freteTexto}
*Total: ${resumo.totalTexto}*

📍 *Endereço de Entrega (Delivery):*
${rua.trim()}, Nº ${numero.trim()} — ${bairro.trim()}
Cidade: ${destinoTexto}
Ref.: ${referencia.trim() || "Não informada"}

👤 *Cliente:* ${nomeCliente.trim()}
${pagamentoTexto}${obsTexto}`;

    return `https://wa.me/${LOJA_CONFIG.whatsapp}?text=${encodeURIComponent(
      mensagem
    )}`;
  }
};