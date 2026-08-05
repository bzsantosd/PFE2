const sensoresIniciais = [
  { id: 1, nome: "Sensor Galpão A", tipo: "Temperatura", valor: 24.5, unidade: "°C", status: "normal" },
  { id: 2, nome: "Sensor Estufa 02", tipo: "Umidade", valor: 88.0, unidade: "%", status: "critico" },
  { id: 3, nome: "Sensor Compressor", tipo: "Pressão", valor: 6.2, unidade: "bar", status: "normal" },
  { id: 4, nome: "Sensor Câmara Fria", tipo: "Temperatura", valor: -2.1, unidade: "°C", status: "normal" },
  { id: 5, nome: "Sensor Almoxarifado", tipo: "Umidade", valor: 45.5, unidade: "%", status: "normal" },
  { id: 6, nome: "Sensor Caldeira", tipo: "Temperatura", valor: 98.4, unidade: "°C", status: "critico" }
];

let estadoSensores = [...sensoresIniciais];

// Seleção de elementos do DOM
const containerGrid = document.getElementById("gridSensores");
const selectFiltro = document.getElementById("filtroTipo");
const btnAtualizar = document.getElementById("btnAtualizar");
const spanTimestamp = document.getElementById("timestamp");

// Helper para escolher um ícone representativo por tipo de sensor
function obterIcone(tipo) {
  switch (tipo) {
    case 'Temperatura': return '';
    case 'Umidade': return '';
    case 'Pressão': return '';
    default: return '';
  }
}


// RENDERIZAÇÃO DINÂMICA DO DOM

function renderizarDashboard(listaSensores) {
  // Limpa o container principal antes de re-renderizar
  containerGrid.innerHTML = "";

  // Percorre o array para gerar os cards dinamicamente
  listaSensores.forEach(sensor => {
    // Avalia a Regra de Negócio: Se status é crítico ou temp > 35°C
    const ehCritico = sensor.status === "critico" || (sensor.tipo === "Temperatura" && sensor.valor > 35);
    
    // Define a classe CSS de alerta condicionalmente
    const classeCardAlerta = ehCritico ? "card-alerta" : "";

    // Cria o elemento container do card
    const card = document.createElement("article");
    card.className = `card-sensor ${classeCardAlerta}`;

    // Monta o layout interno usando Flexbox via CSS
    card.innerHTML = `
      <div class="card-header-flex">
        <span class="card-icone">${obterIcone(sensor.tipo)}</span>
        <span class="card-tipo">${sensor.tipo}</span>
      </div>
      <div>
        <h3>${sensor.nome}</h3>
        <div class="card-valor-flex">
          <span class="valor-numero">${sensor.valor.toFixed(1)}</span>
          <span class="valor-unidade">${sensor.unidade}</span>
        </div>
      </div>
      <div class="card-footer-flex">
        <button class="btn-historico" onclick="alert('Histórico de ${sensor.nome}')">Histórico</button>
      </div>
    `;

      containerGrid.appendChild(card);
  });

  // Atualiza o horário da tela 
  atualizarTimestamp();
}


// FILTROS EM MEMÓRIA

function aplicarFiltro() {
  const tipoSelecionado = selectFiltro.value;

  if (tipoSelecionado === "Todos") {  // Exibe lista completa
    renderizarDashboard(estadoSensores);
  } else { // Filtra pelo tipo selecionado
    const listaFiltrada = estadoSensores.filter(sensor => sensor.tipo === tipoSelecionado);
    renderizarDashboard(listaFiltrada);
  }
}

selectFiltro.addEventListener("change", aplicarFiltro);


// SIMULAÇÃO DE ATUALIZAÇÃO (TEMPO REAL E MATH.RANDOM)

function simularNovasLeituras() {
  estadoSensores = estadoSensores.map(sensor => {
    const variacao = (Math.random() * 3 - 1.5);
    const novoValor = parseFloat((sensor.valor + variacao).toFixed(1));

    // Atualiza o status em condições críticas
    let novoStatus = sensor.status;
    if (sensor.tipo === "Temperatura" && novoValor > 35) {
      novoStatus = "critico";
    } else if (sensor.tipo === "Temperatura" && novoValor <= 35) {
      novoStatus = "normal";
    }

    return {
      ...sensor,
      valor: novoValor,
      status: novoStatus
    };
  });

  // Re-renderiza a tela aplicando o filtro ativo 
  aplicarFiltro();
}

// Atualiza o horário no rodapé
function atualizarTimestamp() {
  const agora = new Date();
  const horarioFormatado = agora.toLocaleTimeString("pt-BR");
  spanTimestamp.textContent = horarioFormatado;
}

btnAtualizar.addEventListener("click", simularNovasLeituras);

// Dispara a cada 30 segundos
setInterval(simularNovasLeituras, 30000);


renderizarDashboard(estadoSensores);