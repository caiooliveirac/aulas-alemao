# DeutschBrücke — Contrato de Infra (OBRIGATÓRIO)

Este documento é o “contrato” para qualquer agente (Copilot/Claude/etc.) que mexa neste projeto.

## Ambiente alvo
- AWS EC2 **ARM64 (aarch64)**
- Docker / Docker Compose
- Nginx **em container** já ativo (`repo-nginx-1`), servindo múltiplas aplicações
- Cloudflare na frente
- Portas 80/443 do host **já estão em uso**

## Regras que NÃO podem ser violadas
1) **NÃO** mapear `80:80` ou `443:443` em `docker-compose.yml`.
2) **NÃO** assumir `x86_64` (sem `platform: linux/amd64`).
3) **NÃO** usar Certbot dentro do container.
4) Reverse proxy é: Nginx do stack (container) → serviço na rede Docker (ex.: `deutschbruecke:3000`).

## Padrão deste repo
- O app entra na rede externa `perguntas_default` (para o Nginx enxergar por nome).
- Porta local opcional p/ debug: `127.0.0.1:8087` → container `:3000`.
- Configuração do proxy fica em `samu-normas/repo/nginx/default.conf`.

## Notas
- Se você alterar a porta, atualize **compose** e o **snippet Nginx**.
- Este projeto usa build `output: "standalone"` do Next para Docker mais confiável.
