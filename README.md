# LaraEvents - Gerenciador de Eventos

Sistema completo de gerenciamento de eventos construído com Laravel 12, React 19, Inertia.js e TypeScript.

## 🚀 Características

- **Dashboard interativo** com estatísticas de eventos
- **Listagem completa** de eventos com paginação, filtros avançados e ordenação
- **Visualização em calendário** usando FullCalendar
- **CRUD completo** de eventos com validação
- **Autenticação** com Laravel Fortify (login, registro, 2FA, recuperação de senha)
- **Documentação API** com Swagger/OpenAPI (L5 Swagger)
- **Interface moderna** com Tailwind CSS e shadcn/ui
- **Responsivo** para todos os dispositivos
- **API REST** para integração com aplicativos externos

## 🛠️ Tecnologias

### Backend
- Laravel 12
- Laravel Fortify (Autenticação)
- Laravel Sanctum (API Tokens)
- L5 Swagger (Documentação API)
- SQLite/MySQL/PostgreSQL
- Pest (Testes)

### Frontend
- React 19
- TypeScript
- Inertia.js
- Vite
- Tailwind CSS
- shadcn/ui
- Radix UI
- FullCalendar
- date-fns

## 📋 Requisitos

- PHP 8.2+
- Node.js 20+
- Composer
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/oHenryy/LaraEvents.git
cd LaraEvents
```

2. Instale as dependências
```bash
composer install
npm install
```

3. Configure o ambiente
```bash
cp .env.example .env
php artisan key:generate
```

4. Configure o banco de dados no arquivo `.env`
```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

5. Execute as migrações e seed
```bash
php artisan migrate
php artisan db:seed
```

6. Inicie os servidores de desenvolvimento
```bash
composer run dev
```

Acesse `http://localhost:8000` no navegador.

## 👤 Credenciais Padrão

- **Email:** test@example.com
- **Senha:** password

## 📚 Documentação da API

Após iniciar o servidor, acesse:
- **Swagger UI:** `http://localhost:8000/api/documentation`
- **JSON:** `http://localhost:8000/docs/api-docs.json`

## 🧪 Testes

Execute os testes com:
```bash
composer test
```

## 📝 Funcionalidades Principais

### Dashboard
- Estatísticas de eventos (hoje, semana, mês, total)
- Eventos por status (agendados, concluídos, cancelados)
- Próximo evento destacado
- Lista dos próximos 5 eventos

### Gestão de Eventos
- Criar, editar e excluir eventos
- Campos: título, descrição, data/hora, local, status, visibilidade, cor, capacidade
- Suporte a eventos de dia inteiro
- Filtros avançados (busca, status, local, data, visibilidade)
- Ordenação por data
- Paginação

### Calendário
- Visualização mensal, semanal e diária
- Navegação intuitiva
- Eventos com cores personalizáveis
- Integração com a lista de eventos

### API REST
- Endpoints completos para CRUD
- Autenticação via Sanctum
- Documentação automática com Swagger
- Suporte a filtros e paginação

## 📄 Licença

Este projeto está sob a licença MIT.
