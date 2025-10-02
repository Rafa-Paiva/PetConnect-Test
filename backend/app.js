import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Variáveis do .env
const PORT = process.env.PORT || 5000;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const SECRET = process.env.SECRET;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const BASE_URL = process.env.BASE_URL;

// Conexão com MongoDB
mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("MongoDB conectado com sucesso"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

// Exemplo de transporter de email
const transporter = nodemailer.createTransport({
  service: "gmail", // ou outro serviço
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

// Rotas de exemplo

// Registro de usuário
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Preencha todos os campos" });

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const User = mongoose.model("User", new mongoose.Schema({
      name: String,
      email: String,
      password: String,
    }));

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email já cadastrado" });

    const newUser = await User.create({ name, email, password: hashedPassword });

    // Criar token de confirmação
    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1d" });

    // Enviar email de confirmação
    await transporter.sendMail({
      from: MAIL_USER,
      to: email,
      subject: "Confirme seu email",
      html: `<p>Clique <a href="${BASE_URL}/confirm/${token}">aqui</a> para confirmar seu email</p>`,
    });

    res.status(201).json({ message: "Usuário criado, email enviado!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Rota de login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const User = mongoose.model("User");

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email não encontrado" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Senha incorreta" });

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });

  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

// Rota de teste
app.get("/", (req, res) => res.send("Backend rodando!"));

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
