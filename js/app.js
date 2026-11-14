/* ==========================================================================
   CONTROLADOR DE INTERFACE (DOM) E EVENTOS — MORAIS & MASSA TORTERIA
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const statusBadge = document.getElementById("store-status-badge");
  const statusText = document.getElementById("store-status-text");

  const gridProntaEntrega = document.getElementById("grid-pronta-entrega");
  const gridEncomenda = document.getElementById("grid-encomenda");
  const sectionProntaEntrega = document.getElementById("section-pronta-entrega");
  const sectionEncomenda = document.getElementById("section-encomenda");
  const filterBtns = document.querySelectorAll(".filter-btn");

  const headerCartBtn = document.getElementById("header-cart-btn");
  const headerCartCount = document.getElementById("header-cart-count");
  const floatingCartBar = document.getElementById("floating-cart-bar");
  const floatingCartCount = document.getElementById("floating-cart-count");
  const floatingCartTotal = document.getElementById("floating-cart-total");
  const openCartBarBtn = document.getElementById("open-cart-bar-btn");

  const cartOverlay = document.getElementById("cart-overlay");
  const cartDrawer = document.getElementById("cart-drawer");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const emptyContinueBtn = document.getElementById("empty-continue-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  const cartEmptyState = document.getElementById("cart-empty-state");
  const cartFilledState = document.getElementById("cart-filled-state");
  const cartItemsList = document.getElementById("cart-items-list");
  const encomendaWarningBox = document.getElementById("encomenda-warning-box");

  const checkoutForm = document.getElementById("checkout-form");
  const entregaCidadeSelect = document.getElementById("entrega-cidade");
  const outraCidadeGroup = document.getElementById("outra-cidade-group");
  const outraCidadeInput = document.getElementById("entrega-outra-cidade");

  const paymentRadios = document.querySelectorAll('input[name="formaPagamento"]');
  const trocoSection = document.getElementById("troco-section");
  const trocoRadios = document.querySelectorAll('input[name="precisaTroco"]');
  const trocoValorGroup = document.getElementById("troco-valor-group");
  const trocoValorInput = document.getElementById("troco-valor");

  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryFrete = document.getElementById("summary-frete");
  const summaryTotal = document.getElementById("summary-total");

  const toastEl = document.getElementById("toast");
  let toastTimeout = null;

  Carrinho.carregar();
  atualizarStatusLoja();
  renderizarCardapio();
  atualizarInterfaceSacola();

  function atualizarStatusLoja() {
    const status = Regras.verificarStatusLoja();
    if (statusText) statusText.textContent = status.texto;
    if (statusBadge) {
      if (!status.aberta) {
        statusBadge.classList.add("closed");
      } else {
        statusBadge.classList.remove("closed");
      }
    }
  }

  function mostrarToast(mensagem) {
    if (!toastEl) return;
    toastEl.textContent = mensagem;
    toastEl.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2200);
  }

  function criarCardProduto(produto) {
    const qtdNoCarrinho = Carrinho.obterQuantidadeItem(produto.id);
    const isEncomenda = produto.categoria === "encomenda";

    const acaoHtml =
      qtdNoCarrinho > 0
        ? `
          <div class="qty-control-inline" aria-label="Controle de quantidade">
            <button type="button" class="qty-btn" data-action="dec" data-id="${produto.id}" aria-label="Diminuir">−</button>
            <span class="qty-value">${qtdNoCarrinho}</span>
            <button type="button" class="qty-btn" data-action="inc" data-id="${produto.id}" aria-label="Aumentar">+</button>
          </div>
        `
        : `
          <button type="button" class="btn-gold" data-action="add" data-id="${produto.id}">
            + Adicionar
          </button>
        `;

    return `
      <div class="product-image-wrap">
        <img
          src="${produto.imagem}"
          alt="${produto.nome}"
          class="product-image"
          onerror="tentarProximoCaminhoImagem(this)"
          loading="lazy"
        />
        <span class="product-badge ${isEncomenda ? "encomenda" : ""}">
          ${produto.badge}
        </span>
      </div>
      <div class="product-body">
        <h3 class="product-title">${produto.nome}</h3>
        <p class="product-desc">${produto.descricao}</p>
        <div class="product-footer">
          <div class="product-price-wrap">
            <span class="product-unit">${produto.unidade}</span>
            <strong class="product-price">${Regras.formatarMoeda(produto.preco)}</strong>
          </div>
          <div class="product-action-container">
            ${acaoHtml}
          </div>
        </div>
      </div>
    `;
  }

  function renderizarCardapio() {
    if (!gridProntaEntrega || !gridEncomenda) return;

    const prontaEntrega = PRODUTOS.filter((p) => p.categoria === "pronta-entrega");
    const encomenda = PRODUTOS.filter((p) => p.categoria === "encomenda");

    // Renderização inicial estrutural (ocorre apenas na primeira carga)
    if (gridProntaEntrega.children.length === 0 && gridEncomenda.children.length === 0) {
      gridProntaEntrega.innerHTML = prontaEntrega
        .map((p) => `<article class="product-card" data-product-id="${p.id}">${criarCardProduto(p)}</article>`)
        .join("");
      gridEncomenda.innerHTML = encomenda
        .map((p) => `<article class="product-card" data-product-id="${p.id}">${criarCardProduto(p)}</article>`)
        .join("");
    } else {
      // Atualização cirúrgica: altera apenas os botões/contadores sem recriar imagens ou piscar a tela
      PRODUTOS.forEach((produto) => {
        const card = document.querySelector(`[data-product-id="${produto.id}"]`);
        if (!card) return;
        const actionContainer = card.querySelector(".product-action-container");
        if (!actionContainer) return;

        const qtdNoCarrinho = Carrinho.obterQuantidadeItem(produto.id);
        actionContainer.innerHTML =
          qtdNoCarrinho > 0
            ? `
              <div class="qty-control-inline" aria-label="Controle de quantidade">
                <button type="button" class="qty-btn" data-action="dec" data-id="${produto.id}" aria-label="Diminuir">−</button>
                <span class="qty-value">${qtdNoCarrinho}</span>
                <button type="button" class="qty-btn" data-action="inc" data-id="${produto.id}" aria-label="Aumentar">+</button>
              </div>
            `
            : `
              <button type="button" class="btn-gold" data-action="add" data-id="${produto.id}">
                + Adicionar
              </button>
            `;
      });
    }
  }

  function atualizarInterfaceSacola() {
    const totalItens = Carrinho.obterTotalItens();
    const subtotal = Carrinho.obterSubtotal();

    if (headerCartCount) headerCartCount.textContent = totalItens;
    if (floatingCartCount) {
      floatingCartCount.textContent =
        totalItens === 1 ? "1 item na sacola" : `${totalItens} itens na sacola`;
    }
    if (floatingCartTotal) floatingCartTotal.textContent = Regras.formatarMoeda(subtotal);

    if (totalItens > 0) {
      if (floatingCartBar) floatingCartBar.classList.remove("hidden");
      if (cartEmptyState) cartEmptyState.classList.add("hidden");
      if (cartFilledState) cartFilledState.classList.remove("hidden");
    } else {
      if (floatingCartBar) floatingCartBar.classList.add("hidden");
      if (cartEmptyState) cartEmptyState.classList.remove("hidden");
      if (cartFilledState) cartFilledState.classList.add("hidden");
    }

    if (cartItemsList) {
      cartItemsList.innerHTML = Carrinho.itens
        .map(
          (item) => `
          <div class="cart-item">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.nome}</div>
              <div class="cart-item-tag">${
                item.categoria === "encomenda"
                  ? "Sob encomenda (1 dia)"
                  : "Pronta-entrega"
              }</div>
              <div class="cart-item-price">${Regras.formatarMoeda(
                item.preco * item.qtd
              )}</div>
            </div>
            <div class="qty-control-inline">
              <button type="button" class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Diminuir">−</button>
              <span class="qty-value">${item.qtd}</span>
              <button type="button" class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Aumentar">+</button>
            </div>
          </div>
        `
        )
        .join("");
    }

    if (encomendaWarningBox) {
      encomendaWarningBox.classList.toggle("hidden", !Carrinho.contemEncomenda());
    }

    atualizarResumoValores();
  }

  function atualizarResumoValores() {
    const subtotal = Carrinho.obterSubtotal();
    const cidade = entregaCidadeSelect ? entregaCidadeSelect.value : "Parnaíba";
    const resumo = Regras.calcularResumo(subtotal, cidade);

    if (summarySubtotal) summarySubtotal.textContent = resumo.subtotalTexto;
    if (summaryFrete) summaryFrete.textContent = resumo.freteTexto;
    if (summaryTotal) summaryTotal.textContent = resumo.totalTexto;
  }

  function abrirSacola() {
    if (!cartOverlay || !cartDrawer) return;
    cartOverlay.classList.remove("hidden");
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function fecharSacola() {
    if (!cartOverlay || !cartDrawer) return;
    cartOverlay.classList.add("hidden");
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (headerCartBtn) headerCartBtn.addEventListener("click", abrirSacola);
  if (openCartBarBtn) openCartBarBtn.addEventListener("click", abrirSacola);
  if (closeCartBtn) closeCartBtn.addEventListener("click", fecharSacola);
  if (emptyContinueBtn) emptyContinueBtn.addEventListener("click", fecharSacola);
  if (cartOverlay) cartOverlay.addEventListener("click", fecharSacola);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawer && cartDrawer.classList.contains("open")) {
      fecharSacola();
    }
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "add") {
      Carrinho.adicionar(id);
      renderizarCardapio();
      atualizarInterfaceSacola();
      mostrarToast("Adicionado à sacola!");
    } else if (action === "inc") {
      Carrinho.alterarQuantidade(id, 1);
      renderizarCardapio();
      atualizarInterfaceSacola();
    } else if (action === "dec") {
      Carrinho.alterarQuantidade(id, -1);
      renderizarCardapio();
      atualizarInterfaceSacola();
    }
  });

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      Carrinho.limpar();
      renderizarCardapio();
      atualizarInterfaceSacola();
      mostrarToast("Sacola esvaziada.");
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filtro = btn.dataset.filter;
      if (filtro === "todos") {
        if (sectionProntaEntrega) sectionProntaEntrega.classList.remove("hidden");
        if (sectionEncomenda) sectionEncomenda.classList.remove("hidden");
      } else if (filtro === "pronta-entrega") {
        if (sectionProntaEntrega) sectionProntaEntrega.classList.remove("hidden");
        if (sectionEncomenda) sectionEncomenda.classList.add("hidden");
      } else if (filtro === "encomenda") {
        if (sectionProntaEntrega) sectionProntaEntrega.classList.add("hidden");
        if (sectionEncomenda) sectionEncomenda.classList.remove("hidden");
      }
    });
  });

  if (entregaCidadeSelect) {
    entregaCidadeSelect.addEventListener("change", () => {
      const isOutra = entregaCidadeSelect.value === "Outra";
      if (outraCidadeGroup) outraCidadeGroup.classList.toggle("hidden", !isOutra);
      if (outraCidadeInput) outraCidadeInput.required = isOutra;
      atualizarResumoValores();
    });
  }

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const isDinheiro = radio.value === "Dinheiro" && radio.checked;
      if (trocoSection) trocoSection.classList.toggle("hidden", !isDinheiro);
      if (!isDinheiro && trocoValorInput) trocoValorInput.required = false;
    });
  });

  trocoRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const precisa = radio.value === "sim" && radio.checked;
      if (trocoValorGroup) trocoValorGroup.classList.toggle("hidden", !precisa);
      if (trocoValorInput) {
        trocoValorInput.required = precisa;
        if (precisa) trocoValorInput.focus();
      }
    });
  });

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (Carrinho.itens.length === 0) {
        mostrarToast("Sua sacola está vazia.");
        return;
      }

      const nomeCliente = document.getElementById("cliente-nome")?.value || "";
      const cidade = entregaCidadeSelect ? entregaCidadeSelect.value : "Parnaíba";
      const outraCidade = outraCidadeInput ? outraCidadeInput.value : "";
      const bairro = document.getElementById("entrega-bairro")?.value || "";
      const numero = document.getElementById("entrega-numero")?.value || "";
      const rua = document.getElementById("entrega-rua")?.value || "";
      const referencia = document.getElementById("entrega-referencia")?.value || "";
      const observacoes = document.getElementById("pedido-observacoes")?.value || "";

      if (!nomeCliente.trim()) {
        mostrarToast("Informe seu nome para continuar.");
        document.getElementById("cliente-nome")?.focus();
        return;
      }

      if (cidade === "Outra" && !outraCidade.trim()) {
        mostrarToast("Informe a cidade de entrega.");
        if (outraCidadeInput) outraCidadeInput.focus();
        return;
      }

      if (!bairro.trim() || !numero.trim() || !rua.trim()) {
        mostrarToast("Preencha o endereço completo de entrega.");
        return;
      }

      const formaPagamentoEl = document.querySelector(
        'input[name="formaPagamento"]:checked'
      );
      const formaPagamento = formaPagamentoEl ? formaPagamentoEl.value : "Pix";

      const precisaTrocoEl = document.querySelector(
        'input[name="precisaTroco"]:checked'
      );
      const precisaTroco = precisaTrocoEl ? precisaTrocoEl.value : "nao";
      const valorTroco = trocoValorInput ? trocoValorInput.value : "";

      if (formaPagamento === "Dinheiro" && precisaTroco === "sim") {
        const valorNumerico = parseFloat(String(valorTroco).replace(",", "."));
        const subtotal = Carrinho.obterSubtotal();
        const resumo = Regras.calcularResumo(subtotal, cidade);

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
          mostrarToast("Informe o valor para o troco.");
          if (trocoValorInput) trocoValorInput.focus();
          return;
        }

        if (cidade === "Parnaíba" && valorNumerico <= resumo.totalNumerico) {
          mostrarToast(
            `O valor para troco deve ser maior que ${resumo.totalTexto}.`
          );
          if (trocoValorInput) trocoValorInput.focus();
          return;
        }
      }

      const urlWhatsApp = Regras.gerarLinkWhatsApp({
        itens: Carrinho.itens,
        subtotal: Carrinho.obterSubtotal(),
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
      });

      window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
    });
  }
});