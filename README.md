# DeutschBrücke (foundation)

Aplicação full-stack para destravar o platô **B1 → B2** de alemão com microtarefas, feedback imediato, produção guiada e revisão (SRS).

## Stack
- Next.js (App Router) + TypeScript
- Backend v1: API routes (Route Handlers) em `src/app/api/*`
- Conteúdo data-driven: `content/lessons/*.json`
- Validação: Zod (`src/content/schema.ts`) + `npm run validate-content`

## Infra (obrigatório)
Leia `AGENT_INFRA_RULES.md` antes de alterar Docker/ports.

## Rodar local (dev)
```bash
cd /home/ubuntu/deutschbruecke
npm install
npm run validate-content
npm run dev
```
Abra `http://localhost:3000`.

## Checks (robustez)
```bash
cd /home/ubuntu/deutschbruecke
npm run sanity
```

## Criar novas lições (sem mexer em React)
- Guia: `CONTENT_AUTHORING_GUIDE.md`
- Schema: `LESSON_SCHEMA.md`
- Prompts para agentes: `PROMPTS/`

Valide sempre:
```bash
cd /home/ubuntu/deutschbruecke
npm run validate-content
```

## Docker / Deploy (Nginx no host + Cloudflare)
Regras:
- **NÃO** mapear 80/443 no compose.
- Na sua infra atual, o reverse proxy principal é o container `repo-nginx-1` (stack em `samu-normas/repo`).
- O DeutschBrücke deve entrar na rede Docker `perguntas_default` para o Nginx enxergar o serviço por nome.

### Base path (path-based routing)
Este app é publicado em `https://mnrs.com.br/alemao`.
Para isso, o container precisa ser buildado com:
- `NEXT_PUBLIC_BASE_PATH=/alemao`

Subir:
```bash
cd /home/ubuntu/deutschbruecke
docker compose build --build-arg NEXT_PUBLIC_BASE_PATH=/alemao
docker compose up -d
```

Snippet Nginx exemplo:
- `docker/nginx_host_snippet.conf`

Na infra dockerizada (recomendada neste servidor), adicione o location/upstream no Nginx do stack `samu-normas/repo`.

## Endpoints (v1)
- `GET /api/lessons`
- `GET /api/lessons/:id`
- `GET /api/progress` e `POST /api/progress` (store em arquivo; v1 opcional)
