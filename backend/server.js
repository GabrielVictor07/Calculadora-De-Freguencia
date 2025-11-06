import express from "express";
import cors from "cors";
import disciplinaRouter from "./router/disciplinaRouter.js";
import faltaRouter from "./router/faltaRouter.js";
import userRouter from "./router/userRouter.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", disciplinaRouter);
app.use("/api", faltaRouter);
app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
