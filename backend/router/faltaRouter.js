import express from "express";
import { criarFalta, listarFaltasPorUC } from "../controllers/faltaController.js";

const router = express.Router();

router.post("/faltas", criarFalta);
router.get("/faltas/:idUC", listarFaltasPorUC);

export default router;
