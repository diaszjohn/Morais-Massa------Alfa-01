/* ==========================================================================
   DADOS DA LOJA E CATÁLOGO DE PRODUTOS — MORAIS & MASSA TORTERIA
   ========================================================================== */

const LOJA_CONFIG = {
  nome: "Morais & Massa Torteria",
  whatsapp: "5586995563868",
  instagram: "@moraismassa",
  horarioAbertura: 8,    // 08:00
  horarioFechamento: 22, // 22:00
  taxaParnaiba: 7.00
};

const PRODUTOS = [
  {
    id: "pudim-copo",
    nome: "Pudim Clássico Premium (No Copo)",
    categoria: "pronta-entrega",
    badge: "Pronta-entrega",
    unidade: "Copo individual",
    preco: 15.00,
    descricao:
      "Pudim de leite condensado ultra cremoso, de textura lisa e aveludada, finalizado com uma camada generosa de calda artesanal de caramelo dourado em copo individual lacrado.",
    imagem: "pudim.jpg"
  },
  {
    id: "cheesecake-morango-fatia",
    nome: "Cheesecake Geleia de Morango",
    categoria: "pronta-entrega",
    badge: "Pronta-entrega",
    unidade: "Fatia individual",
    preco: 17.00,
    descricao:
      "Base crocante de biscoito amanteigado com recheio cremoso e equilibrado de cream cheese, coberto por uma camada abundante de geleia artesanal de morango com pedaços da fruta.",
    imagem: "cheesemorango.jpeg"
  },
  {
    id: "cheesecake-belga-fatia",
    nome: "Cheesecake Chocolate Belga Amargo",
    categoria: "pronta-entrega",
    badge: "Pronta-entrega",
    unidade: "Fatia individual",
    preco: 17.00,
    descricao:
      "Base escura e crocante de cacau, creme suave e aerado de cheesecake, cobertura intensa de ganache e finalização generosa com raspas de chocolate belga amargo.",
    imagem: "cheesechoc.jpeg"
  },
  {
    id: "torta-morango-inteira",
    nome: "Torta Inteira — Geleia de Morango",
    categoria: "encomenda",
    badge: "Sob encomenda (1 dia)",
    unidade: "Inteira • Rende 14 fatias",
    preco: 210.00,
    descricao:
      "Torta inteira com rendimento de 14 fatias generosas. Base amanteigada, creme de cream cheese e cobertura abundante de geleia artesanal de morango. Pedido com 1 dia de antecedência.",
    imagem: "cheesemorango.jpeg"
  },
  {
    id: "torta-belga-inteira",
    nome: "Torta Inteira — Chocolate Belga Amargo",
    categoria: "encomenda",
    badge: "Sob encomenda (1 dia)",
    unidade: "Inteira • Rende 14 fatias",
    preco: 210.00,
    descricao:
      "Torta inteira com rendimento de 14 fatias generosas. Base de cacau, creme de cheesecake, ganache intenso e raspas de chocolate belga amargo. Pedido com 1 dia de antecedência.",
    imagem: "cheesechoc.jpeg"
  }
];