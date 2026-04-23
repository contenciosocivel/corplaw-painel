# CORPLAW — Painel de Gestão

Sistema web de gestão de processos judiciais integrado com ADVBOX.

---

## 🚀 Como subir no Vercel (passo a passo)

### 1. Instale o Node.js
Baixe em: https://nodejs.org (versão LTS)

### 2. Instale o Git
Baixe em: https://git-scm.com

### 3. Crie uma conta gratuita no Vercel
Acesse: https://vercel.com → "Sign Up" → entre com GitHub

### 4. Crie uma conta gratuita no GitHub
Acesse: https://github.com → "Sign up"

### 5. Suba o projeto para o GitHub

Abra o terminal (Prompt de Comando ou PowerShell no Windows):

```bash
# Entre na pasta do projeto
cd corplaw

# Instale as dependências
npm install

# Inicie o Git
git init
git add .
git commit -m "primeiro commit"

# Crie um repositório no GitHub (pelo site) e depois:
git remote add origin https://github.com/SEU_USUARIO/corplaw-painel.git
git push -u origin main
```

### 6. Conecte o Vercel ao GitHub

1. Acesse vercel.com → "Add New Project"
2. Selecione o repositório `corplaw-painel`
3. Clique em "Deploy"

### 7. Configure as variáveis de ambiente no Vercel

No painel do Vercel, vá em:
**Settings → Environment Variables**

Adicione as 3 variáveis:

| Nome | Valor |
|------|-------|
| `ADVBOX_TOKEN` | Seu token da API ADVBOX |
| `PAINEL_PASSWORD` | Uma senha forte para o escritório |
| `SESSION_SECRET` | Uma string aleatória de 40+ caracteres |

Para gerar o SESSION_SECRET, acesse: https://generate-secret.vercel.app/32

### 8. Redeploy

Após adicionar as variáveis, clique em **"Redeploy"** no Vercel.

### 9. Acesse o painel

O Vercel vai te dar uma URL como:
`https://corplaw-painel.vercel.app`

Compartilhe essa URL com as pessoas do escritório.

---

## 🔑 Onde fica o token ADVBOX

1. Acesse o ADVBOX
2. Vá em **Configurações → Integrações e API**
3. Ative a API se ainda não estiver ativa
4. Copie o token Bearer gerado

---

## 🔄 Como funciona a atualização dos dados

Os dados são buscados diretamente do ADVBOX toda vez que alguém acessa o painel.
O cache é de **5 minutos** para não sobrecarregar a API.

No painel, há um botão **↻** no canto superior direito para forçar atualização.

---

## 👥 Como adicionar mais usuários

Todos usam a mesma senha definida em `PAINEL_PASSWORD`.
Se precisar de senhas individuais, me avise que expandimos.

---

## 🛠 Para rodar localmente (opcional)

```bash
# Crie o arquivo de variáveis
cp .env.local.example .env.local
# Edite o .env.local com seus dados reais

# Instale dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev

# Acesse: http://localhost:3000
```
