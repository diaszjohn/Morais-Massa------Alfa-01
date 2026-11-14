/* ==========================================================================
   DADOS E CONFIGURAÇÕES DA LOJA — MORAIS & MASSA TORTERIA
   ========================================================================== */

const LOJA_CONFIG = Object.freeze({
  nome: "Morais & Massa Torteria",
  whatsappNumber: "5586995563868",
  taxaParnaiba: 7.00,
  cidadePadrao: "Parnaíba",
  horaAbertura: 8,
  horaFechamento: 22,
  storageKey: "morais_massa_cart_v1"
});

const PRODUTOS = Object.freeze([
  {
    id: "pudim-copo",
    nome: "Pudim Clássico Premium no Copo",
    categoria: "pronta-entrega",
    badge: "Pronta-Entrega",
    unidade: "Unidade • Copo",
    preco: 15.00,
    imagem: "img/pudim.jpg",
    descricao: "Textura extremamente cremosa e aveludada, sem furinhos, finalizado com calda artesanal de caramelo âmbar brilhante."
  },
  {
    id: "cheesecake-morango",
    nome: "Cheesecake Geleia de Morango",
    categoria: "pronta-entrega",
    badge: "Pronta-Entrega",
    unidade: "Fatia Individual",
    preco: 17.00,
    imagem: "img/cheesemorango.jpeg",
    descricao: "Base crocante de biscoito amanteigado, creme suave de cream cheese e cobertura generosa de geleia artesanal de morangos frescos."
  },
  {
    id: "cheesecake-chocolate",
    nome: "Cheesecake Chocolate Belga Amargo",
    categoria: "pronta-entrega",
    badge: "Pronta-Entrega",
    unidade: "Fatia Individual",
    preco: 17.00,
    imagem: "img/cheesechoc.jpeg",
    descricao: "Combinação equilibrada entre a cremosidade do cheesecake tradicional e ganache intensa de chocolate belga meio amargo."
  },
  {
    id: "torta-inteira-morango",
    nome: "Torta Inteira — Geleia de Morango (14 Fatias)",
    categoria: "encomenda",
    badge: "Encomenda • 1 dia",
    unidade: "Inteira • 14 Fatias",
    preco: 210.00,
    imagem: "img/cheesemorango.jpeg",
    descricao: "Ideal para celebrações e eventos. Rende 14 fatias generosas. Pedido com 1 dia de antecedência e pagamento antecipado."
  },
  {
    id: "torta-inteira-chocolate",
    nome: "Torta Inteira — Chocolate Belga Amargo (14 Fatias)",
    categoria: "encomenda",
    badge: "Encomenda • 1 dia",
    unidade: "Inteira • 14 Fatias",
    preco: 210.00,
    imagem: "img/cheesechoc.jpeg",
    descricao: "Nossa receita assinatura de chocolate belga amargo em tamanho inteiro (14 fatias). Pedido com 1 dia de antecedência e pagamento antecipado."
  }
]);

function tentarProximoCaminhoImagem(imgEl) {
  if (!imgEl) return;
  if (imgEl.src.includes("img/")) {
    imgEl.src = "moraismassa.png";
  }
}