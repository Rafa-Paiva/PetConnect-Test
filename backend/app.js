require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// ================== Conexão MongoDB ==================
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@rafael.19dznhl.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("✅ Conectado ao MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
  })
  .catch((err) => console.log("Erro MongoDB:", err));

// ================== Model ==================
const User = mongoose.model("User", {
  name: String,
  email: { type: String, required: true },
  passwordHash: String,
  verified: { type: Boolean, default: false },
});

// ================== Configuração de E-mail ==================
let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ================== Middleware de Autenticação ==================
function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado" });

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token inválido" });
  }
}

// ================== Rotas ==================
app.get("/", (req, res) => {
  res.status(200).json({ msg: "API online 🚀" });
});

// ---------- Registro ----------
app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name || !email || !password || password !== confirmpassword) {
    return res.status(422).json({ msg: "Dados inválidos" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(422).json({ msg: "E-mail já cadastrado" });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({ name, email, passwordHash, verified: false });
  await user.save();

  const emailToken = jwt.sign({ email: user.email }, process.env.SECRET, {
    expiresIn: "15m",
  });

  const verifyUrl = `${process.env.BASE_URL}/auth/verify-email?token=${emailToken}`;

  const info = await transporter.sendMail({
    from: '"Suporte" <no-reply@meusite.com>',
    to: user.email,
    subject: "Confirme seu e-mail",
    html: `<p>Olá ${user.name},</p>
           <p>Clique para confirmar seu e-mail:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>
           <p>Este link expira em 15 minutos.</p>`,
  });

  res.status(201).json({
    msg: "Usuário criado. Confirme seu e-mail para ativar a conta.",
    preview: nodemailer.getTestMessageUrl(info), // só aparece se usar Ethereal
  });
});

// ---------- Verificação de E-mail ----------
app.get("/auth/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Token ausente");

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).send("Usuário não encontrado");

    if (user.verified) return res.send("E-mail já confirmado ✅");

    user.verified = true;
    await user.save();

    res.send("E-mail confirmado com sucesso 🎉");
  } catch (err) {
    res.status(400).send("Token inválido ou expirado");
  }
});

// ---------- Login ----------
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(422).json({ msg: "Email e senha obrigatórios" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });

  if (!user.verified)
    return res.status(403).json({ msg: "Confirme seu e-mail antes de logar" });

  const checkPassword = await bcrypt.compare(password, user.passwordHash);
  if (!checkPassword) return res.status(422).json({ msg: "Senha inválida" });

  const secret = process.env.SECRET;
  const token = jwt.sign({ id: user._id }, secret);

  res.status(200).json({ msg: "Login OK", token });
});

// ---------- Rota Protegida ----------
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-passwordHash");
  if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });

  res.status(200).json({ user });
});
