import { Link, useNavigate } from "react-router-dom";
import banner from "@/img/banner.png";
import logo from "@/img/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { api } from "@/services/api";

export function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [termos, setTermos] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nome || !email || !senha || !termos) {
      alert("Preencha todos os campos e aceite os termos");
      return;
    }
    const res = await api.register(nome, email, senha);
    if (res.message === "Usuário criado com sucesso") {
      alert("Conta criada! Verifique seu email");
      navigate("/");
    } else {
      alert(res.message || "Erro ao criar conta");
    }
  };

  return (
    <main className="flex">
      <img src={banner} className="h-screen" />
      <div className="flex flex-col justify-center gap-8 mt-10 max-w-xl !mx-auto w-full">
        <div className="flex flex-col gap-4">
          <img src={logo} className="w-20 !mb-2" />
          <h1 className="text-6xl font-semibold">Comece aqui</h1>
          <p>Crie uma nova conta</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleRegister}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              type="text"
              id="nome"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="seuemail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              type="password"
              id="senha"
              placeholder="**********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 !py-1">
            <Checkbox
              id="termos"
              checked={termos}
              onCheckedChange={(checked) => setTermos(checked)}
            />
            <Label htmlFor="termos">
              Aceite os{" "}
              <span className="text-primary underline underline-offset-4 decoration-primary">
                termos de uso
              </span>
            </Label>
          </div>
          <Button size="xl" type="submit">
            Criar Conta
          </Button>

          <div className="flex items-center justify-center">
            <p>
              Já tem uma conta?{" "}
              <Link
                to="/"
                className="underline underline-offset-4 decoration-neutral-400"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
