// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // <-- trocado do bcrypt
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@rafael.19dznhl.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error(err));

// Modelo de usuário
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Rota de cadastro
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Preencha todos os campos' });

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Email já cadastrado' });

  const hashedPassword = await bcrypt.hash(password, 12); // <-- bcryptjs funciona igual

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  return res.status(201).json({ message: 'Usuário registrado com sucesso' });
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Preencha todos os campos' });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Email ou senha inválidos' });

  const isMatch = await bcrypt.compare(password, user.password); // <-- bcryptjs

  if (!isMatch) return res.status(400).json({ message: 'Email ou senha inválidos' });

  const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1h' });

  return res.json({ token, user: { name: user.name, email: user.email } });
});

// Teste de rota protegida
app.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token ausente' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
