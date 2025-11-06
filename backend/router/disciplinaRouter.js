import express from "express";
import { criarDisciplina, listarDisciplinas, excluirDisciplina  } from "../controllers/disciplinaController.js";

const router = express.Router();

router.post("/disciplinas", criarDisciplina);
router.get("/disciplinas", listarDisciplinas);
router.delete("/disciplinas/:id", excluirDisciplina);

export default router;
