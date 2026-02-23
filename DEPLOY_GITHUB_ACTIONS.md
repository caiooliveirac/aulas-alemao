# CI/CD (GitHub Actions) — aulas-alemao

Este repo tem:
- CI: `.github/workflows/ci.yml`
- CD (v1 simples): `.github/workflows/cd.yml` (SSH → `git pull`/reset → `docker compose up -d --build`)

## GitHub Secrets necessários
No GitHub: **Settings → Secrets and variables → Actions → New repository secret**

- `EC2_HOST`: IP ou hostname da EC2 (ex.: `1.2.3.4`)
- `EC2_USER`: usuário SSH (ex.: `ubuntu`)
- `EC2_SSH_KEY`: chave privada **PEM** (conteúdo completo)

## Como gerar a chave para o deploy
Na sua máquina local (ou em um ambiente seguro):
```bash
ssh-keygen -t ed25519 -C "aulas-alemao-deploy" -f ./aulas-alemao-deploy
```

No servidor (EC2), adicione a pública em `~/.ssh/authorized_keys` do usuário do deploy:
```bash
cat aulas-alemao-deploy.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Depois, copie o conteúdo do arquivo **privado** `aulas-alemao-deploy` para o secret `EC2_SSH_KEY`.

## Pré-requisitos no servidor
- Repo clonado em `/home/ubuntu/aulas-alemao`
- `docker` e `docker compose` instalados
- Usuário do deploy com permissão para rodar Docker (ex.: estar no grupo `docker`)

## Como funciona o deploy
Em push para `main`:
1) GitHub Actions conecta via SSH
2) Atualiza o repo para `origin/main` (hard reset)
3) Roda `docker compose up -d --build`
4) Roda `docker image prune -f`

## Override do basePath
Produção usa `NEXT_PUBLIC_BASE_PATH=/alemao` (configurado em `docker-compose.yml`).

Se precisar, você pode setar temporariamente no servidor:
```bash
cd /home/ubuntu/aulas-alemao
export NEXT_PUBLIC_BASE_PATH="/alemao"
docker compose up -d --build
```
