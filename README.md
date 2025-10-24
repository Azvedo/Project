# Course Sphere — Instruções de uso

Este repositório contém o frontend (React + Vite) e o backend (.NET 8).

IMPORTANTE: os repositórios usados são em memória. Os dados permanecem enquanto o backend estiver ativo; se o backend for reiniciado, todos os dados serão perdidos.

## Pré-requisitos

- Node.js
- .NET 8 SDK
- (Opcional) Docker e Docker Compose

## Executando localmente

Backend

Abra um PowerShell na pasta do backend e execute:

```powershell
Set-Location -Path "D:\project\Course-Sphere-api"
dotnet watch run
```

A API ficará disponível em: http://localhost:5000

Frontend

Abra um PowerShell na pasta do frontend e execute:

```powershell
Set-Location -Path "D:\project\Course-Sphere"
npm install
npm run dev
```

O frontend roda normalmente em: http://localhost:5173

## Executando com Docker Compose

Na raiz do projeto:

```powershell
docker compose up --build
```

Após subir os containers:

- Frontend: http://localhost:8080
- Swagger (API): http://localhost:5000/swagger

## Uso básico

- Acesse a página de login no frontend para cadastrar uma conta (email válido e senha com pelo menos 6 caracteres) e fazer login.
- Na Dashboard é possível criar cursos. Ao adicionar um instrutor a partir das sugestões, o sistema cadastra esse instrutor no backend automaticamente — a senha inicial utilizada é `123`.
- Ao clicar em um curso você acessa a página de detalhes, onde é possível ver aulas e executar ações conforme as permissões do usuário.

## API

- Documentação (Swagger): http://localhost:5000/swagger
- Endpoint para listar usuários: `GET /api/Auth/all` (útil para visualizar e-mails dos instrutores cadastrados)

## Observações

- Dados em memória: tudo é perdido quando o backend é reiniciado.
- Segurança: implementação simples para desenvolvimento 

