/* ==========================================================================
   GERENCIAMENTO DA SACOLA (ESTADO + LOCALSTORAGE)
   ========================================================================== */

const STORAGE_KEY = "morais_massa_sacola_v1";

const Carrinho = {
  itens: [],

  carregar() {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (!salvo) {
        this.itens = [];
        return;
      }
      const parsed = JSON.parse(salvo);
      if (!Array.isArray(parsed)) {
        this.itens = [];
        return;
      }
      this.itens = parsed.filter(
        (item) =>
          item &&
          typeof item.qtd === "number" &&
          item.qtd > 0 &&
          PRODUTOS.some((p) => p.id === item.id)
      );
    } catch (erro) {
      this.itens = [];
    }
  },

  salvar() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itens));
    } catch (erro) {
      // Ignora falha em modo privado
    }
  },

  adicionar(produtoId) {
    const produto = PRODUTOS.find((p) => p.id === produtoId);
    if (!produto) return;

    const existente = this.itens.find((item) => item.id === produtoId);
    if (existente) {
      existente.qtd += 1;
    } else {
      this.itens.push({
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria,
        unidade: produto.unidade,
        preco: produto.preco,
        qtd: 1
      });
    }

    this.salvar();
  },

  alterarQuantidade(produtoId, delta) {
    const index = this.itens.findIndex((item) => item.id === produtoId);
    if (index === -1) return;

    this.itens[index].qtd += delta;

    if (this.itens[index].qtd <= 0) {
      this.itens.splice(index, 1);
    }

    this.salvar();
  },

  remover(produtoId) {
    this.itens = this.itens.filter((item) => item.id !== produtoId);
    this.salvar();
  },

  limpar() {
    this.itens = [];
    this.salvar();
  },

  obterQuantidadeItem(produtoId) {
    const item = this.itens.find((i) => i.id === produtoId);
    return item ? item.qtd : 0;
  },

  obterTotalItens() {
    return this.itens.reduce((acc, item) => acc + item.qtd, 0);
  },

  obterSubtotal() {
    return this.itens.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  },

  contemEncomenda() {
    return this.itens.some((item) => item.categoria === "encomenda");
  }
};