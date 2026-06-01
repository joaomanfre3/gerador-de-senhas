# 🔑 Gerador de Senhas

Gere senhas fortes e seguras na hora, ajustando tamanho e tipos de caractere. Com medidor de força e cópia em um toque — tudo no seu navegador, sem nada sair dele.

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white)

## O que faz

- **Tamanho ajustável** de 6 a 40 caracteres
- Liga/desliga **minúsculas, maiúsculas, números e símbolos**
- Opção de **evitar caracteres ambíguos** (O/0, l/1/I...)
- **Medidor de força** com estimativa de entropia em bits
- **Copiar** a senha em um toque
- **Gerar outra** instantaneamente
- Lembra suas preferências no navegador
- 100% **responsivo** e **offline**

## Segurança

A aleatoriedade vem de `crypto.getRandomValues` (o gerador criptográfico do navegador), não do `Math.random`. A geração usa **rejection sampling** pra não enviesar nenhum caractere, garante ao menos um de cada tipo escolhido e embaralha o resultado. **Nada é enviado pra servidor algum** — a senha nasce e morre no seu navegador.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide. Sem banco — as preferências ficam no `localStorage`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Deploy

Pronto pra Vercel — importe o repositório, build padrão (`next build`), zero variáveis de ambiente.

---

Feito por [@joaomanfre3](https://github.com/joaomanfre3).
