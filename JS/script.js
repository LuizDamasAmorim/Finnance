let saldoTotal = 5000;
let cardEditando = null;
let cardParaExcluir = null;
let orcamentoAtual = 0;

const cores = {
  pink: "#ff2d55",
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#facc15",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  blue: "#3b82f6",
  indigo: "#6366f1",
  purple: "#a855f7",
  violet: "#8b5cf6",
  gray: "#6b7280"
};

/* ===================== EMPTY STATE ===================== */

function verificarEmptyState() {
  const total = document.querySelectorAll(".categoria-card").length;
  const empty = document.getElementById("emptyState");

  if (total === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }
}

/* ===================== FORMATAÇÃO ===================== */

function formatarDinheiro(valor) {
  return (Number(valor) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/* ===================== SALDO ===================== */

function abrirModalSaldo() {
  document.getElementById("modalSaldo").classList.add("active");
  document.getElementById("fab").style.opacity = "0";
  document.getElementById("inputSaldo").focus();
}

function fecharModalSaldo() {
  document.getElementById("modalSaldo").classList.remove("active");
  document.getElementById("fab").style.opacity = "1";
}

function salvarSaldo() {
  const valorInput = document.getElementById("inputSaldo").value;

  atualizarSaldoModal();

  if (!valorInput) {
    mostrarToast("Digite um valor");
    return;
  }

  saldoTotal = parseFloat(valorInput) || 0;

  atualizarSaldoUI();
  atualizarBarra();
  atualizarSaldoDisponivel();

  fecharModalSaldo();

  document.getElementById("inputSaldo").value = "";
}

function atualizarSaldoUI() {
  document.getElementById("saldoTotalValor").innerText =
    formatarDinheiro(saldoTotal);

  document.getElementById("saldo").innerText =
    formatarDinheiro(saldoTotal);
}

/* ===================== RESERVADO ===================== */

function atualizarReservado() {
  const cards = document.querySelectorAll(".categoria-card");

  let total = 0;

  cards.forEach(card => {
    const el = card.querySelector(".valor");
    if (!el) return;

    const numero = el.innerText
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".");

    total += parseFloat(numero) || 0;
  });

  document.getElementById("valorReservado").innerText =
    formatarDinheiro(total);
}

/* ===================== OLHO ===================== */

let visivel = true;

function toggleSaldo() {
  const valores = document.querySelectorAll(".money");
  const icon = document.querySelector(".eye i");

  if (visivel) {
    valores.forEach(el => {
      el.dataset.valorOriginal = el.innerText;
      el.innerText = "••••••";
    });

    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    valores.forEach(el => {
      if (el.dataset.valorOriginal) {
        el.innerText = el.dataset.valorOriginal;
      }
    });

    icon.classList.replace("fa-eye-slash", "fa-eye");
  }

  visivel = !visivel;
}

/* ===================== BARRA ===================== */

function atualizarBarra() {
  const cards = document.querySelectorAll(".categoria-card");

  let totalCategorias = 0;

  cards.forEach(card => {
    const el = card.querySelector(".valor");
    if (!el) return;

    const numero = el.innerText
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".");

    totalCategorias += parseFloat(numero) || 0;
  });

  if (saldoTotal === 0) return;

  const porcentagem = (totalCategorias / saldoTotal) * 100;
  const final = Math.min(porcentagem, 100);

  document.getElementById("valores").innerText =
    Math.round(final) + "%";

  document.querySelector(".progress-fill").style.width =
    final + "%";
}

/* ===================== CONTADOR ===================== */

function atualizarContador() {
  const total = document.querySelectorAll(".categoria-card").length;
  const texto = total === 1 ? "item" : "itens";

  document.getElementById("contadorCategorias").innerText =
    `${total} ${texto}`;
}

/* ===================== MODAL ===================== */

const modal = document.getElementById("modal");

function abrirModal() {
  modal.classList.add("active");
  document.getElementById("fab").style.display = "none";

  atualizarSaldoModal();

  if (!cardEditando) {
    document.getElementById("tituloModal").innerText = "Nova categoria";
    document.querySelector(".criar-btn").innerText = "Criar categoria";
  }
}

function fecharModal() {
  modal.classList.remove("active");
  document.getElementById("fab").style.display = "flex";
}

/* ===================== ICONES ===================== */

let iconeSelecionado = "fa-utensils";
let corSelecionada = "pink";

document.querySelectorAll(".icon-option").forEach(icon => {
  icon.addEventListener("click", () => {
    document.querySelectorAll(".icon-option")
      .forEach(i => i.classList.remove("active"));

    icon.classList.add("active");
    iconeSelecionado = icon.dataset.icon;
  });
});

document.querySelectorAll(".color-option").forEach(color => {
  color.addEventListener("click", () => {
    document.querySelectorAll(".color-option")
      .forEach(c => c.classList.remove("active"));

    color.classList.add("active");
    corSelecionada = color.dataset.color;
  });
});

/* ===================== SALDO MODAL ===================== */

function atualizarSaldoModal() {
  const reservadoTexto = document.getElementById("valorReservado").innerText;

  const reservado = parseFloat(
    reservadoTexto.replace("R$", "").replace(/\./g, "").replace(",", ".")
  ) || 0;

  const disponivel = saldoTotal - reservado;

  document.getElementById("saldoDisponivelModal").innerText =
    "Disponível: " + formatarDinheiro(disponivel);
}

/* ===================== CRIAR / EDITAR ===================== */

function criarCategoria() {
  const nome = document.getElementById("nomeCategoria").value.trim();
  const valorBruto = document.getElementById("valorCategoria").value;

  if (!nome || valorBruto === "") {
    mostrarToast("Preencha todos os campos");
    return;
  }

  const valor = parseFloat(valorBruto);
  const grid = document.getElementById("categoriasGrid");

  if (cardEditando) {
    cardEditando.querySelector(".nome").innerText = nome;
    cardEditando.querySelector(".valor").innerText =
      formatarDinheiro(valor);

    cardEditando.querySelector(".icon").className =
      `icon ${corSelecionada}`;

    cardEditando.querySelector(".icon i").className =
      `fa-solid ${iconeSelecionado}`;

    cardEditando = null;
  } else {
    const card = document.createElement("div");
    card.classList.add("categoria-card");

    card.onclick = () => abrirDetalheCategoria(card);

    card.innerHTML = `
      <div class="actions">
        <button class="edit" onclick="event.stopPropagation(); editarCategoria(this)">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>

        <button class="delete" onclick="excluirCategoria(event, this)">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>

      <div class="icon ${corSelecionada}">
        <i class="fa-solid ${iconeSelecionado}"></i>
      </div>

      <p class="nome">${nome}</p>
      <h3 class="valor money">${formatarDinheiro(valor)}</h3>

      <span class="arrow">›</span>
    `;

    card.onclick = () => abrirDetalheCategoria(card);

    grid.appendChild(card);
  }


  fecharModal();

  document.getElementById("nomeCategoria").value = "";
  document.getElementById("valorCategoria").value = "";

  atualizarContador();
  atualizarBarra();
  atualizarReservado();
  atualizarSaldoDisponivel();
  verificarEmptyState();
}

/* ===================== DETALHE ===================== */

function abrirDetalheCategoria(card) {

  const nome = card.querySelector(".nome").innerText;
  const valor = card.querySelector(".valor").innerText;

  const iconDiv = card.querySelector(".icon");
  const iconClass = iconDiv.querySelector("i").className;

  // pega a cor (pink, green, blue...)
  const corClasse = [...iconDiv.classList].find(c => c !== "icon");

  const corHex = cores[corClasse] || "#22c55e";

  // 🔥 ABRE TELA
  document.getElementById("telaDetalhe").classList.add("active");

  // 🔥 PREENCHE DADOS
  document.querySelector(".detalhe-texto h2").innerText = nome;
  const orcamentoEl = document.getElementById("detalheOrcamento");

  orcamentoEl.innerText = valor;
  orcamentoEl.dataset.valor = valor;

  // 🔥 ATUALIZA ÍCONE
  const detalheIcon = document.querySelector(".detalhe-icon");

  detalheIcon.className = "detalhe-icon " + corClasse;
  detalheIcon.innerHTML = `<i class="${iconClass}"></i>`;


if (detalheIcon) {
  detalheIcon.style.boxShadow = `
  0 10px 25px ${corHex}40,
  0 0 20px ${corHex}30
`;
}

  // 🔥 FUNDO DO HEADER 
const topo = document.querySelector(".detalhe-topo");

if (topo) {
  const corEscura = escurecerCor(corHex, 0.4); // mais escuro

  topo.style.background = `
    linear-gradient(135deg, ${corEscura} 0%, #0b0b0b 120%)
  `;
}

// 🔥 BOTÃO DE ADICIONAR
const btnAdd = document.querySelector(".btn-add-gasto");
if (btnAdd) {
  btnAdd.style.background = corHex;
  btnAdd.style.boxShadow = `0 4px 15px ${corHex}50`;
}

// 🔥 BOTÃO DE VOLTAR + TEXTO
const btnVoltar = document.querySelector(".btn-voltar");
const label = document.querySelector(".detalhe-label");

if (btnVoltar) {
  btnVoltar.style.color = corHex;
  btnVoltar.style.textShadow = `0 0 6px ${corHex}40`;
}

if (label) {
  label.style.color = corHex;
  label.style.textShadow = `0 0 8px ${corHex}50`;
}

// 🔥 ORÇAMENTO (ÍCONE + TEXTO)
const orcamentoHeader = document.querySelector(".orcamento-header");
const orcamentoIcon = orcamentoHeader?.querySelector("i");
const orcamentoTexto = orcamentoHeader?.querySelector("span");

if (orcamentoIcon) {
  orcamentoIcon.style.color = corHex;
  orcamentoIcon.style.textShadow = `0 0 6px ${corHex}40`;
}

if (orcamentoTexto) {
  orcamentoTexto.style.color = corHex;
  orcamentoTexto.style.textShadow = `0 0 8px ${corHex}50`;
}

// 🔥 ÍCONE DE TRANSAÇÕES
const iconeTransacao = document.querySelectorAll(".gasto-icon").forEach(icon => {
  icon.style.background = corHex + "20";
  icon.style.color = corHex;
});

  atualizarResumo();
  recalcularOrcamento();
}

function fecharDetalhe() {
  document.getElementById("telaDetalhe").classList.remove("active");
}

/* ===================== EXCLUIR ===================== */

function fecharConfirm() {
  document.getElementById("confirmModal").classList.remove("active");
  cardParaExcluir = null;
}

function confirmarExclusao() {
  if (cardParaExcluir) {
    cardParaExcluir.remove();
  }

  fecharConfirm();
  atualizarContador();
  atualizarBarra();
  atualizarReservado();
  atualizarSaldoDisponivel();
  verificarEmptyState();
}

/* ===================== SALDO DISPONÍVEL ===================== */

function atualizarSaldoDisponivel() {
  const reservadoTexto = document.getElementById("valorReservado").innerText;

  const reservado = parseFloat(
    reservadoTexto.replace("R$", "").replace(/\./g, "").replace(",", ".")
  ) || 0;

  const disponivel = saldoTotal - reservado;

  document.getElementById("saldo").innerText =
    formatarDinheiro(disponivel);
}

/* ===================== TOAST ===================== */

function mostrarToast(mensagem, tipo = "erro") {
  const toast = document.getElementById("toast");

  toast.innerText = mensagem;
  toast.style.background =
    tipo === "erro" ? "#ff2d55" : "#22c55e";

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function editarCategoria(botao) {
  const card = botao.closest(".categoria-card");

  cardEditando = card;

  const nome = card.querySelector(".nome").innerText;

  const valor = card.querySelector(".valor").innerText
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  document.getElementById("nomeCategoria").value = nome;
  document.getElementById("valorCategoria").value = valor;

  document.getElementById("tituloModal").innerText = "Editar categoria";
  document.querySelector(".criar-btn").innerText = "Salvar alterações";

  abrirModal();
}
function excluirCategoria(event, botao) {
  event.stopPropagation();

  cardParaExcluir = botao.closest(".categoria-card");
  document.getElementById("confirmModal").classList.add("active");
}

function atualizarOrcamento(reservado, gasto) {
  const restante = reservado - gasto;

  const porcentagem = reservado === 0 ? 0 : (gasto / reservado) * 100;

  const percentEl = document.getElementById("orcamentoPercent");
  const restanteEl = document.getElementById("orcamentoRestante");
  const alerta = document.getElementById("alertaOrcamento");
  const barra = document.getElementById("orcamentoFill");

  document.getElementById("orcamentoReservado").innerText =
    formatarDinheiro(reservado);

  document.getElementById("orcamentoGasto").innerText =
    formatarDinheiro(gasto);

  restanteEl.innerText = formatarDinheiro(restante);

  // 🔥 RESET
  percentEl.classList.remove("negativo-alerta");
  restanteEl.classList.remove("negativo-alerta");
  alerta.style.display = "none";
  barra.style.background = ""; // volta cor normal

  // 🔥 SE EXCEDEU
  if (gasto > reservado) {
  const excedido = gasto - reservado;

  percentEl.innerText = "Orçamento excedido!";

  percentEl.classList.add("negativo-alerta");
  restanteEl.classList.add("negativo-alerta");

  alerta.style.display = "flex";

  alerta.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation"></i>
    Excedeu ${formatarDinheiro(excedido)}
  `;

  barra.style.background = "#ff3b30";
  barra.style.width = "100%";

} else {
  // ✅ AQUI ESTAVA FALTANDO
  percentEl.innerText = Math.round(porcentagem) + "% utilizado";

  barra.style.width = porcentagem + "%";
}
}

function abrirModalGasto() {
  document.getElementById("modalGasto").classList.add("active");
}

function fecharModalGasto() {
  document.getElementById("modalGasto").classList.remove("active");
}

function salvarGasto() {
  const desc = document.getElementById("descGasto").value;
  const valor = document.getElementById("valorGasto").value;

  if (!desc || !valor) {
    mostrarToast("Preencha os campos");
    return;
  }

  const lista = document.getElementById("gastosLista");

  const item = document.createElement("div");
  item.classList.add("gasto-card");

  item.innerHTML = `
    <div class="gasto-left">
      <div class="gasto-icon">
        <i class="fa-solid fa-receipt"></i>
      </div>

      <div class="gasto-info">
        <span class="gasto-nome">${desc}</span>
        <span class="gasto-data">Agora</span>
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:8px;">
      <span class="gasto-valor negativo">
        - ${formatarDinheiro(valor)}
      </span>

      <button onclick="removerGasto(this)" 
        style="
          background: rgba(255,59,48,0.15);
          border:none;
          width:28px;
          height:28px;
          border-radius:50%;
          color:#ff3b30;
          cursor:pointer;
        ">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;

  lista.appendChild(item);

  mostrarToast("Gasto adicionado", "sucesso");

  fecharModalGasto();
  verificarEmptyGastos();
  atualizarResumo();

  document.getElementById("descGasto").value = "";
  document.getElementById("valorGasto").value = "";
}

function removerGasto(botao) {
  const item = botao.closest(".gasto-card");
  item.remove();

  mostrarToast("Gasto removido", "sucesso");

  verificarEmptyGastos();
  atualizarResumo();
}

function verificarEmptyGastos() {
  const lista = document.getElementById("gastosLista");
  const empty = document.getElementById("emptyGastos");

  const total = lista.querySelectorAll(".gasto-card").length;

  if (total === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }
}

function calcularGastos() {
  const gastos = document.querySelectorAll(".gasto-card");

  let total = 0;
  let maior = 0;

  gastos.forEach(g => {
    const valorTexto = g.querySelector(".gasto-valor").innerText;

    const numero = valorTexto
      .replace("R$", "")
      .replace("-", "")
      .replace(/\./g, "")
      .replace(",", ".");

    const valor = parseFloat(numero) || 0;

    total += valor;

    if (valor > maior) {
      maior = valor;
    }
  });

  const quantidade = gastos.length;
  const media = quantidade ? total / quantidade : 0;

  return {
    total,
    maior,
    quantidade,
    media
  };
}

function atualizarResumo() {
  const dados = calcularGastos();

  // pega valor reservado da categoria atual
  const reservadoTexto = document.getElementById("detalheOrcamento").dataset.valor;

  const reservado = parseFloat(
    reservadoTexto.replace("R$", "").replace(/\./g, "").replace(",", ".")
  ) || 0;

  // atualiza orçamento
  atualizarOrcamento(reservado, dados.total);

  // stats
  document.getElementById("totalTransacoes").innerText = dados.quantidade;
  document.getElementById("maiorGasto").innerText = formatarDinheiro(dados.maior);
  document.getElementById("mediaGasto").innerText = formatarDinheiro(dados.media);
}

function recalcularOrcamento() {
  const gastos = document.querySelectorAll(".gasto-card");

  let totalGasto = 0;

  gastos.forEach(gasto => {
    const valorTexto = gasto.querySelector(".gasto-valor").innerText
      .replace("-", "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".");

    totalGasto += parseFloat(valorTexto) || 0;
  });

  const reservadoTexto = document.getElementById("detalheOrcamento").dataset.valor;

  const reservado = parseFloat(
    reservadoTexto.replace("R$", "").replace(/\./g, "").replace(",", ".")
  ) || 0;

  atualizarOrcamento(reservado, totalGasto);
}

function escurecerCor(hex, fator = 0.7) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  const novoR = Math.floor(r * fator);
  const novoG = Math.floor(g * fator);
  const novoB = Math.floor(b * fator);

  return `rgb(${novoR}, ${novoG}, ${novoB})`;
}

/* ===================== INIT ===================== */

document.addEventListener("DOMContentLoaded", () => {
  atualizarSaldoUI();
  atualizarReservado();
  atualizarBarra();
  atualizarContador();
  atualizarSaldoDisponivel();
  verificarEmptyState();
  verificarEmptyGastos();
});