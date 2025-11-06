const API_URL = "http://localhost:3000/api";

const disciplinasContainer = document.getElementById("disciplinasContainer");
const addDisciplinaBtn = document.getElementById("addDisciplinaBtn");
const modalDisciplina = document.getElementById("modalDisciplina");
const modalFalta = document.getElementById("modalFalta");
const fecharModal = document.getElementById("fecharModal");
const fecharModalFalta = document.getElementById("fecharModalFalta");
const salvarDisciplina = document.getElementById("salvarDisciplina");
const salvarFalta = document.getElementById("salvarFalta");

let idUCSelecionada = null;
let ucSelecionada = null; // Armazena dados da UC selecionada

// Calcula limite de faltas em horas e dias
function calcularLimiteFaltas(cargaHoraria, horasPorAula, percentual) {
  const horasFalta = cargaHoraria * (percentual / 100);
  const diasFalta = horasFalta / horasPorAula;
  return {
    horasFalta: horasFalta.toFixed(2),
    diasFalta: Math.floor(diasFalta)
  };
}

// Calcula horas e dias restantes considerando faltas já registradas
function calcularDiasRestantes(cargaHoraria, horasPorAula, percentual, totalHorasFaltadas) {
  const limiteHoras = cargaHoraria * (percentual / 100);
  const horasRestantes = limiteHoras - totalHorasFaltadas;
  const diasRestantes = Math.floor(horasRestantes / horasPorAula);
  return {
    horasRestantes: horasRestantes.toFixed(2),
    diasRestantes: diasRestantes >= 0 ? diasRestantes : 0
  };
}

// Renderiza as disciplinas (UCs) de forma resumida
async function renderizarDisciplinas(disciplinas) {
  disciplinasContainer.innerHTML = "";

  for (const uc of disciplinas) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${uc.NomeUC}</h3>
      <button class="btn-detalhes" data-id="${uc.ID_UC}">Ver Detalhes</button>
    `;

    disciplinasContainer.appendChild(card);
  }

  // Adicionar listener para ver detalhes
  document.querySelectorAll(".btn-detalhes").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const idUC = e.target.dataset.id;
      ucSelecionada = disciplinas.find(d => d.ID_UC == idUC);
      await mostrarDetalhesUC(ucSelecionada);
    })
  );
}

// Mostra detalhes da UC com registrar falta e excluir
async function mostrarDetalhesUC(uc) {
  // Buscar faltas
  const resFaltas = await fetch(`${API_URL}/faltas/${uc.ID_UC}`);
  const faltas = await resFaltas.json();
  const totalHorasFaltadas = faltas.reduce((acc, f) => acc + parseFloat(f.HorasComputadas), 0);

  const limite = calcularLimiteFaltas(uc.CargaHorariaTotal, uc.HorasPorAula, uc.PercentualLimiteFaltas);
  const restante = calcularDiasRestantes(uc.CargaHorariaTotal, uc.HorasPorAula, uc.PercentualLimiteFaltas, totalHorasFaltadas);

  disciplinasContainer.innerHTML = `
    <button id="voltarBtn">← Voltar</button>
    <h2>${uc.NomeUC}</h2>
    <p><strong>Carga Horária:</strong> ${uc.CargaHorariaTotal}h</p>
    <p><strong>Limite de Faltas:</strong> ${uc.PercentualLimiteFaltas}%</p>
    <p><strong>Horas permitidas:</strong> ${limite.horasFalta}h</p>
    <p><strong>Dias permitidos:</strong> ${limite.diasFalta} dias</p>
    <p><strong>Horas restantes:</strong> ${restante.horasRestantes}h</p>
    <p><strong>Dias restantes:</strong> ${restante.diasRestantes} dias</p>
    <p><strong>Início:</strong> ${new Date(uc.DataInicio).toLocaleDateString()}</p>
    ${uc.DataTerminoEstimada ? `<p><strong>Término:</strong> ${new Date(uc.DataTerminoEstimada).toLocaleDateString()}</p>` : ""}
    <button id="registrarFaltaBtn">Registrar Falta</button>
    <button id="excluirUCBtn">Excluir Unidade Curricular</button>
    <h3>Faltas Registradas</h3>
    <div id="faltasContainer"></div>
  `;

  const voltarBtn = document.getElementById("voltarBtn");
  voltarBtn.addEventListener("click", carregarDisciplinas);

  // Renderizar faltas
  const faltasContainer = document.getElementById("faltasContainer");
  if (faltas.length === 0) {
    faltasContainer.innerHTML = "<p>Nenhuma falta registrada.</p>";
  } else {
    faltasContainer.innerHTML = "";
    faltas.forEach(f => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `<p><strong>Data:</strong> ${new Date(f.DataFalta).toLocaleDateString()}</p>
                       <p><strong>Horas:</strong> ${f.HorasComputadas}</p>`;
      faltasContainer.appendChild(div);
    });
  }

  // Botão registrar falta
  document.getElementById("registrarFaltaBtn").addEventListener("click", () => {
    idUCSelecionada = uc.ID_UC;
    modalFalta.style.display = "flex";
  });

  // Botão excluir UC (funcional)
  document.getElementById("excluirUCBtn").addEventListener("click", async () => {
    if (confirm("Deseja realmente excluir esta unidade curricular?")) {
      try {
        const res = await fetch(`${API_URL}/disciplinas/${uc.ID_UC}`, { method: "DELETE" });
        if (res.ok) {
          alert("Unidade curricular excluída com sucesso!");
          carregarDisciplinas(); // Volta para a lista de disciplinas
        } else {
          const erro = await res.json();
          alert(erro.mensagem || "Erro ao excluir UC.");
        }
      } catch (err) {
        console.error("Erro ao excluir UC:", err);
      }
    }
  });
}

// Registrar falta com atualização em tempo real
salvarFalta.addEventListener("click", async () => {
  const DataFalta = document.getElementById("dataFalta").value;
  const HorasComputadas = parseFloat(document.getElementById("horasFalta").value);

  if (!DataFalta || !HorasComputadas) {
    alert("Preencha todos os campos.");
    return;
  }

  const limite = calcularLimiteFaltas(ucSelecionada.CargaHorariaTotal, ucSelecionada.HorasPorAula, ucSelecionada.PercentualLimiteFaltas);

  const resFaltas = await fetch(`${API_URL}/faltas/${idUCSelecionada}`);
  const faltas = await resFaltas.json();
  const totalHorasFaltadas = faltas.reduce((acc, f) => acc + parseFloat(f.HorasComputadas), 0) + HorasComputadas;

  if (totalHorasFaltadas > limite.horasFalta) {
    alert(`Atenção! Este registro ultrapassa o limite de faltas da disciplina (${limite.horasFalta}h).`);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/faltas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ID_UC_Associada: idUCSelecionada,
        DataFalta,
        HorasComputadas,
      }),
    });

    if (res.ok) {
      modalFalta.style.display = "none";
      // Atualiza detalhes da UC após registrar falta
      await mostrarDetalhesUC(ucSelecionada);
    } else {
      const erro = await res.json();
      alert(erro.mensagem || "Erro ao registrar falta.");
    }
  } catch (err) {
    console.error("Erro ao salvar falta:", err);
  }

  
});

// Modais
addDisciplinaBtn.addEventListener("click", () => (modalDisciplina.style.display = "flex"));
fecharModal.addEventListener("click", () => (modalDisciplina.style.display = "none"));
fecharModalFalta.addEventListener("click", () => (modalFalta.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modalDisciplina) modalDisciplina.style.display = "none";
  if (e.target === modalFalta) modalFalta.style.display = "none";
});

// Inicializa
async function carregarDisciplinas() {
  try {
    const res = await fetch(`${API_URL}/disciplinas`);
    const data = await res.json();
    await renderizarDisciplinas(data);
  } catch (err) {
    console.error("Erro ao carregar disciplinas:", err);
  }
}

// Cadastrar disciplina (UC)
salvarDisciplina.addEventListener("click", async () => {
  const NomeUC = document.getElementById("nomeUC").value.trim();
  const CargaHorariaTotal = document.getElementById("cargaHoraria").value;
  const HorasPorAula = document.getElementById("horasPorAula").value;
  const PercentualLimiteFaltas = document.getElementById("percentualLimite").value;
  const DataInicio = document.getElementById("dataInicio").value;
  const DataTerminoEstimada = document.getElementById("dataTermino").value || null;

  if (!NomeUC || !CargaHorariaTotal || !HorasPorAula || !PercentualLimiteFaltas || !DataInicio) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/disciplinas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        NomeUC,
        CargaHorariaTotal,
        PercentualLimiteFaltas,
        HorasPorAula,
        DataInicio,
        DataTerminoEstimada,
      }),
    });

    if (res.ok) {
      modalDisciplina.style.display = "none";
      carregarDisciplinas();
    } else {
      const erro = await res.json();
      alert(erro.mensagem || "Erro ao cadastrar disciplina.");
    }
  } catch (err) {
    console.error("Erro ao salvar disciplina:", err);
  }
});

carregarDisciplinas();