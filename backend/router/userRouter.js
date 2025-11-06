import express from "express";
import { criarUsuario } from "../controllers/userController.js";

const router = express.Router();

router.post("/usuarios", criarUsuario);

export default router;
