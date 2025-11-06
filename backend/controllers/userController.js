import db from "../db.js";
import bcrypt from "bcrypt";

// Criar usuário
export const criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }

  try {
    const [existe] = await db.promise().query("SELECT * FROM usuario WHERE Email = ?", [email]);
    if (existe.length > 0) {
      return res.status(400).json({ mensagem: "Email já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    await db.promise().query("INSERT INTO usuario ( Nome, Email, SenhaHash ) VALUES (?, ?, ?)", [nome, email, senhaHash]);

    res.json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao criar usuário." });
  }
};
