import { useState } from "react";
import { api } from "@/services/api";
import banner from "@/img/banner.png";
import logo from "@/img/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Forget() {
  const [email, setEmail] = useState("");

  const handleForget = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/forget-password", { email });
      alert(response.data.msg || "Verifique seu email para redefinir a senha.");
    } catch (err) {
      alert(err.response?.data?.msg || "Erro ao enviar email");
      console.error(err);
    }
  };

  return (
    <main className="flex">
      <img src={banner} className="h-screen" />
      <div className="flex flex-col justify-center gap-15 mt-10 max-w-xl !mx-auto w-full">
        <div className="flex flex-col gap-4">
          <img src={logo} className="w-20 !mb-2" />
          <h1 className="text-6xl font-semibold">Esqueceu a senha?</h1>
          <p>Recupere a senha de sua conta</p>
        </div>

        <form className="flex flex-col gap-10" onSubmit={handleForget}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="seu@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button size="xl" type="submit">
            Enviar
          </Button>
        </form>
      </div>
    </main>
  );
}
