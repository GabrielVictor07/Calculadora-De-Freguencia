import db from "../db.js";

// Criar disciplina
export const criarDisciplina = async (req, res) => {
  const { NomeUC, CargaHorariaTotal, PercentualLimiteFaltas, HorasPorAula, DataInicio, DataTerminoEstimada } = req.body;

  if (!NomeUC || !CargaHorariaTotal || !PercentualLimiteFaltas || !HorasPorAula || !DataInicio) {
    return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios." });
  }

  try {
    await db.promise().query(
      `INSERT INTO UnidadeCurricular (NomeUC, CargaHorariaTotal, PercentualLimiteFaltas, HorasPorAula, DataInicio, DataTerminoEstimada)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [NomeUC, CargaHorariaTotal, PercentualLimiteFaltas, HorasPorAula, DataInicio, DataTerminoEstimada]
    );
    res.json({ mensagem: "Disciplina adicionada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao cadastrar disciplina." });
  }
};

// Listar disciplinas
export const listarDisciplinas = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM UnidadeCurricular");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar disciplinas." });
  }
};

// Excluir disciplina
export const excluirDisciplina = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: "ID da disciplina é obrigatório." });
  }

  try {
    const [result] = await db.promise().query(
      "DELETE FROM UnidadeCurricular WHERE ID_UC = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Disciplina não encontrada." });
    }

    res.json({ mensagem: "Disciplina excluída com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao excluir disciplina." });
  }
};
