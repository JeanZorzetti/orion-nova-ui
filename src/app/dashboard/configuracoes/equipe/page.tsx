"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, UserPlus, Trash2, Loader2, Crown, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Pessoa {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  pendente?: boolean;
}

interface Equipe {
  owner: Pessoa | null;
  members: Pessoa[];
  seats: { used: number; limit: number };
  isOwner: boolean;
}

export default function EquipePage() {
  const [equipe, setEquipe] = useState<Equipe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const carregar = async () => {
    const res = await fetch("/api/team");
    if (res.ok) setEquipe(await res.json());
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const adicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    setAviso(null);

    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome, email }),
    });
    const data = await res.json();

    if (res.ok) {
      setNome("");
      setEmail("");
      setAviso(`Convite enviado para ${data.member.email}. A pessoa define a senha pelo link do e-mail.`);
      await carregar();
    } else {
      setErro(data.error ?? "Não foi possível adicionar.");
    }
    setSalvando(false);
  };

  const remover = async (id: string) => {
    setRemovendo(id);
    setErro(null);
    const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" });
    if (res.ok) await carregar();
    else setErro((await res.json()).error ?? "Não foi possível remover.");
    setRemovendo(null);
  };

  if (carregando) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const limite = equipe?.seats.limit ?? 1;
  const usados = equipe?.seats.used ?? 1;
  const semAssento = limite !== -1 && usados >= limite;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <Link href="/dashboard/configuracoes">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Equipe
        </h1>
        <p className="text-muted-foreground mt-1">
          Quem você adicionar enxerga os mesmos clientes, produtos, vendas e
          financeiro que você. A cobrança continua só na sua conta.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Badge variant={semAssento ? "destructive" : "secondary"}>
          {usados} de {limite === -1 ? "ilimitados" : limite}{" "}
          {limite === 1 ? "usuário" : "usuários"}
        </Badge>
        {semAssento && (
          <Link href="/precos" className="text-primary hover:underline">
            Ver planos com mais usuários
          </Link>
        )}
      </div>

      {erro && (
        <Alert variant="destructive">
          <AlertTitle>Não deu certo</AlertTitle>
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      {aviso && (
        <Alert>
          <AlertTitle>Convite enviado</AlertTitle>
          <AlertDescription>{aviso}</AlertDescription>
        </Alert>
      )}

      {equipe?.isOwner && (
        <form onSubmit={adicionar} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Adicionar pessoa
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Maria de Souza"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria@suaempresa.com.br"
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={salvando || semAssento}>
            {salvando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar convite"
            )}
          </Button>
          {semAssento && (
            <p className="text-sm text-muted-foreground">
              Seu plano não tem assento sobrando.
            </p>
          )}
        </form>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pessoa</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Situação</TableHead>
            {equipe?.isOwner && <TableHead className="w-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipe?.owner && (
            <TableRow>
              <TableCell className="font-medium">{equipe.owner.name || "—"}</TableCell>
              <TableCell className="text-muted-foreground">{equipe.owner.email}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="gap-1">
                  <Crown className="h-3 w-3" />
                  Dono da conta
                </Badge>
              </TableCell>
              {equipe.isOwner && <TableCell />}
            </TableRow>
          )}
          {equipe?.members.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.name || "—"}</TableCell>
              <TableCell className="text-muted-foreground">{m.email}</TableCell>
              <TableCell>
                {m.pendente ? (
                  <Badge variant="outline" className="gap-1">
                    <MailWarning className="h-3 w-3" />
                    Aguardando definir a senha
                  </Badge>
                ) : (
                  <Badge variant="secondary">Ativo</Badge>
                )}
              </TableCell>
              {equipe.isOwner && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remover(m.id)}
                    disabled={removendo === m.id}
                    aria-label={`Remover ${m.name || m.email}`}
                  >
                    {removendo === m.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {equipe && equipe.members.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Você ainda é a única pessoa nesta conta.
        </p>
      )}
    </div>
  );
}
