# LAB03 - Plataforma de Cursos Online

## 1. Objetivo

Desenvolver a interface funcional de uma **Plataforma de Cursos Online**, aplicando conceitos de estruturação semântica com **HTML5**, estilização responsiva com **Bootstrap 5** e manipulação dinâmica de dados utilizando **JavaScript (ES6+)**. O foco será a criação de formulários de cadastro, listagens dinâmicas e a simulação de persistência de dados em memória.

## 2. Contexto do Estudo de Caso

A plataforma visa gerenciar o ciclo de vida acadêmico e financeiro de alunos e instrutores. O sistema deve ser capaz de lidar com a hierarquia de conteúdo (Cursos > Módulos > Aulas), o progresso dos usuários, a organização de Trilhas de Conhecimento e a gestão de assinaturas/pagamentos.

## 3. Requisitos Técnicos

A aplicação deve ser estritamente desenvolvida utilizando:

- **HTML5:** Para a estrutura das páginas.
- **Bootstrap 5:** Para o layout (Grid System, Cards, Modais, Tabelas e Navbar).
- **TypeScript:** React com TypeScript.
- **React:** criar os próprios componentes com Bootstrap.

## 4. Escopo da Implementação

O grupo/aluno deverá implementar as seguintes funcionalidades baseadas nas entidades fornecidas:

### A. Módulo Acadêmico e de Conteúdo

1. **Gestão de Cursos e Categorias:** Criar interfaces para cadastrar Categorias, Cursos e Trilhas. Deve ser possível visualizar a relação entre eles (ex: listar cursos de uma categoria específica).
2. **Estrutura de Aulas:** Implementar a lógica para adicionar Módulos a um curso e Aulas a cada módulo, respeitando o campo Ordem.

### B. Módulo de Usuário e Progresso

1. **Cadastro de Usuários e Matrículas:** Tela de registro de Usuários e simulação do ato de matrícula em um curso ou assinatura de um Plano.
2. **Controle de Progresso:** Interface para marcar o Status de conclusão de aulas e geração visual de Certificados (com código de verificação).

### C. Módulo Financeiro

1. **Assinaturas e Pagamentos:** Criar um fluxo de checkout simples onde o usuário escolhe um Plano e simula um Pagamento, gerando um registro com Método de Pagamento e ID da Transação.

## 5. Detalhamento das Entidades (Modelo de Dados)

Para cada tela, utilize os campos definidos abaixo como base para os formulários de entrada e colunas de visualização:

| Categoria  | Entidades Relacionadas                     |
| ---------- | ------------------------------------------ |
| Core       | Usuários, Categorias, Cursos               |
| Conteúdo   | Módulos, Aulas                             |
| Interação  | Matrículas, Progresso_Aulas, Avaliações    |
| Curadoria  | Trilhas, Trilhas_Cursos, Certificados      |
| Negócio    | Planos, Assinaturas, Pagamentos            |

## 6. Critérios de Avaliação

- **Design e Usabilidade das Interfaces:** criação de componentes com Bootstrap
- **Estrutura do projeto:** components, model, services, pages etc
- **Roteamento:** roteamento dos components
- **Consumo da API:** JSON Server

---

## Modelo de Dados

### 1. Tabela `Usuarios`

- `ID_Usuario` (PK - Chave Primária)
- `NomeCompleto`
- `Email` (Unique)
- `SenhaHash`
- `DataCadastro`

### 2. Tabela `Categorias`

- `ID_Categoria` (PK)
- `Nome` (Unique)
- `Descricao`

### 3. Tabela `Cursos`

- `ID_Curso` (PK)
- `Titulo`
- `Descricao`
- `ID_Instrutor` (FK - Chave Estrangeira para `Usuarios`)
- `ID_Categoria` (FK para `Categorias`)
- `Nivel` (Ex: Iniciante, Intermediário, Avançado)
- `DataPublicacao`
- `TotalAulas`
- `TotalHoras`

### 4. Tabela `Modulos`

- `ID_Modulo` (PK)
- `ID_Curso` (FK para `Cursos`)
- `Titulo`
- `Ordem` (Para sequenciar os módulos dentro do curso)

### 5. Tabela `Aulas`

- `ID_Aula` (PK)
- `ID_Modulo` (FK para `Modulos`)
- `Titulo`
- `TipoConteudo` (Ex: Vídeo, Texto, Quiz)
- `URL_Conteudo`
- `DuracaoMinutos`
- `Ordem` (Para sequenciar as aulas dentro do módulo)

### 6. Tabela `Matriculas`

- `ID_Matricula` (PK)
- `ID_Usuario` (FK para `Usuarios`)
- `ID_Curso` (FK para `Cursos`)
- `DataMatricula`
- `DataConclusao` (Nulável)

### 7. Tabela `Progresso_Aulas`

- `ID_Usuario` (PK, FK para `Usuarios`)
- `ID_Aula` (PK, FK para `Aulas`)
- `DataConclusao`
- `Status` (Ex: Concluído)

### 8. Tabela `Avaliacoes`

- `ID_Avaliacao` (PK)
- `ID_Usuario` (FK para `Usuarios`)
- `ID_Curso` (FK para `Cursos`)
- `Nota` (Ex: 1 a 5)
- `Comentario` (Nulável)
- `DataAvaliacao`

### 9. Tabela `Trilhas`

- `ID_Trilha` (PK)
- `Titulo`
- `Descricao`
- `ID_Categoria` (FK para `Categorias`)

### 10. Tabela `Trilhas_Cursos` (Tabela Associativa)

- `ID_Trilha` (PK, FK para `Trilhas`)
- `ID_Curso` (PK, FK para `Cursos`)
- `Ordem` (Para definir a sequência dos cursos na trilha)

### 11. Tabela `Certificados`

- `ID_Certificado` (PK)
- `ID_Usuario` (FK para `Usuarios`)
- `ID_Curso` (FK para `Cursos`)
- `ID_Trilha` (FK para `Trilhas`, Null)
- `CodigoVerificacao` (Unique)
- `DataEmissao`

### 12. Tabela `Planos`

- `ID_Plano` (PK)
- `Nome` (not Null)
- `Descricao`
- `Preco` (not Null)
- `DuracaoMeses` (not Null)

### 13. Tabela `Assinaturas`

- `ID_Assinatura` (PK)
- `ID_Usuario` (FK para `Usuarios`, not Null)
- `ID_Plano` (FK para `Planos`, not Null)
- `DataInicio` (not Null)
- `DataFim` (not Null)

### 14. Tabela `Pagamentos`

- `ID_Pagamento` (PK)
- `ID_Assinatura` (FK para `Assinaturas`, not Null)
- `ValorPago` (not Null — valor vindo de `Planos`)
- `DataPagamento` (not Null)
- `MetodoPagamento` (not Null)
- `Id_Transacao_Gateway` (not Null)
- `DataFim` (not Null)
