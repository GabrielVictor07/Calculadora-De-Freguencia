import db from "../db.js";

// Criar falta
export const criarFalta = async (req, res) => {
  const { ID_UC_Associada, DataFalta, HorasComputadas } = req.body;

  if (!ID_UC_Associada || !DataFalta || !HorasComputadas) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }

  try {
    await db.promise().query(
      "INSERT INTO Falta (ID_UC_Associada, DataFalta, HorasComputadas) VALUES (?, ?, ?)",
      [ID_UC_Associada, DataFalta, HorasComputadas]
    );
    res.json({ mensagem: "Falta adicionada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao cadastrar falta." });
  }
};

// Listar faltas de uma disciplina
export const listarFaltasPorUC = async (req, res) => {
  const { idUC } = req.params;

  try {
    const [rows] = await db.promise().query("SELECT * FROM Falta WHERE ID_UC_Associada = ?", [idUC]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar faltas." });
  }
};
