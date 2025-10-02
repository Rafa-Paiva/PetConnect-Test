import { Link, useNavigate } from "react-router-dom";
import banner from "@/img/banner.png";
import logo from "@/img/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { api } from "@/services/api";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.login(email, senha);
    setLoading(false);
    if (res.token) {
      localStorage.setItem("token", res.token);
      navigate("/pet");
    } else {
      alert(res.message || "Erro ao fazer login");
    }
  };

  return (
    <main className="flex">
      <img src={banner} className="h-screen" />
      <div className="flex flex-col justify-center gap-10 mt-20 max-w-xl !mx-auto w-full">
        <div className="flex flex-col gap-4">
          <img src={logo} className="w-20 !mb-2" />
          <h1 className="text-6xl font-semibold">Bem vindo!</h1>
          <p>Faça o login em sua conta</p>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleLogin}>
          <div className="flex flex-col gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="seuemail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="senha">Senha</Label>
              <Link to="/forget" className="text-sm text-foreground/60">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              type="password"
              id="senha"
              placeholder="**********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <Button size="xl" type="submit">
            {loading ? "Entrando..." : "Fazer Login"}
          </Button>

          <div className="flex items-center justify-center">
            <p>
              Não tem uma conta?{" "}
              <Link
                to="/cadastro"
                className="underline underline-offset-4 decoration-neutral-400"
              >
                Cadastre-se agora
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
