/* ==========================================================================
   GERENCIAMENTO DO CARRINHO — MORAIS & MASSA TORTERIA
   ========================================================================== */

const Carrinho = (() => {
  let itens = [];

  function carregar() {
    try {
      const raw = localStorage.getItem(LOJA_CONFIG.storageKey);
      if (!raw) {
        itens = [];
        return;
      }
      const parsed = JSON.parse(raw);
      const validos = new Set(PRODUTOS.map((p) => p.id));

      itens = parsed
        .filter((item) => validos.has(item.id) && Number.isInteger(item.qtd) && item.qtd > 0 && item.qtd <= 50)
        .map((item) => {
          const produto = PRODUTOS.find((p) => p.id === item.id);
          return {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            categoria: produto.categoria,
            qtd: item.qtd
          };
        });
    } catch {
      itens = [];
    }
  }

  function salvar() {
    try {
      const dadosParaSalvar = itens.map((item) => ({ id: item.id, qtd: item.qtd }));
      localStorage.setItem(LOJA_CONFIG.storageKey, JSON.stringify(dadosParaSalvar));
    } catch {
      // Ignora erro se storage estiver bloqueado
    }
  }

  function adicionar(produtoId) {
    const produto = PRODUTOS.find((p) => p.id === produtoId);
    if (!produto) return;

    const existente = itens.find((i) => i.id === produtoId);
    if (existente) {
      if (existente.qtd < 50) existente.qtd++;
    } else {
      itens.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        categoria: produto.categoria,
        qtd: 1
      });
    }
    salvar();
  }

  function alterarQuantidade(produtoId, delta) {
    const index = itens.findIndex((i) => i.id === produtoId);
    if (index === -1) return;

    itens[index].qtd += delta;
    if (itens[index].qtd <= 0) {
      itens.splice(index, 1);
    }
    salvar();
  }

  function obterQuantidadeItem(produtoId) {
    const item = itens.find((i) => i.id === produtoId);
    return item ? item.qtd : 0;
  }

  function obterTotalItens() {
    return itens.reduce((acc, item) => acc + item.qtd, 0);
  }

  function obterSubtotal() {
    return itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  }

  function contemEncomenda() {
    return itens.some((item) => item.categoria === "encomenda");
  }

  function limpar() {
    itens = [];
    salvar();
  }

  return {
    get itens() {
      return itens;
    },
    carregar,
    adicionar,
    alterarQuantidade,
    obterQuantidadeItem,
    obterTotalItens,
    obterSubtotal,
    contemEncomenda,
    limpar
  };
})();