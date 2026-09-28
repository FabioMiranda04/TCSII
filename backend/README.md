# Backend — Plataforma de Cursos (NestJS + Prisma + PostgreSQL + JWT)

Construído seguindo os tutoriais em [`../docs`](../docs): `crud-nestjs.md` e `jwt-autenticacao.md`, com o modelo de dados de `plataforma-de-cursos.md`.

## Como rodar

1. Crie um banco PostgreSQL e ajuste o `.env` (veja `.env.example`):
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/DBdev?schema=public"
   JWT_SECRET="troque-por-uma-chave-longa-e-aleatoria"
   ```
2. Instale e aplique a migration:
   ```bash
   npm install
   npx prisma migrate dev
   npx prisma generate
   ```
3. Inicie: `npm run start:dev` e acesse o Swagger em `http://localhost:3000/api`.

## Como testar (igual ao tutorial)

1. `POST /usuarios` (público) → cria usuário; `SenhaHash` recebe a senha em texto e é salva como hash bcrypt.
2. `POST /auth/login` com `{ "email", "password" }` → copie o `access_token`.
3. No Swagger, clique em **Authorize**, cole o token e use as rotas protegidas.

## Rotas

| Recurso | Rota | Públicas (sem token) |
| --- | --- | --- |
| Auth | `/auth/login` | login |
| Usuários | `/usuarios` | `POST` (cadastro) |
| Categorias | `/categorias` | `GET` |
| Cursos | `/cursos?ID_Categoria=` | `GET` |
| Módulos | `/modulos?ID_Curso=` (ordenado por `Ordem`) | `GET` |
| Aulas | `/aulas?ID_Modulo=` (ordenado por `Ordem`) | `GET` |
| Trilhas | `/trilhas?ID_Categoria=` | `GET` |
| Trilhas_Cursos | `/trilhas-cursos?ID_Trilha=`, `/trilhas-cursos/:idTrilha/:idCurso` | `GET` |
| Avaliações | `/avaliacoes?ID_Curso=` | `GET` |
| Planos | `/planos` | `GET` |
| Matrículas | `/matriculas?ID_Usuario=` | — |
| Progresso_Aulas | `/progresso-aulas?ID_Usuario=`, `/progresso-aulas/:idUsuario/:idAula` | — |
| Certificados | `/certificados?ID_Usuario=`, `/certificados/verificar/:codigo` | `verificar` |
| Assinaturas | `/assinaturas?ID_Usuario=` | — |
| Pagamentos | `/pagamentos?ID_Assinatura=` | — |

Datas são enviadas em ISO (`"2026-06-11"`). Erros do Prisma viram respostas amigáveis: duplicado → 409, FK inválida → 400, ID inexistente → 404.
