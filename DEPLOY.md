# Deploying `will-it-pop-web`

This repository owns the public frontend for [will-it-pop.online](https://will-it-pop.online) and the production Nginx site config.

`src/data/xhs_collection/final_notes.json` and the referenced local image assets are shipped inside the frontend build. When that data changes, you only need to deploy this repository. The backend does not need a second copy of the file or images.

## What the deployment looks like

- Public site root: `/srv/will-it-pop/web/current`
- Nginx config: `/etc/nginx/sites-available/will-it-pop`
- Domain: `will-it-pop.online`
- API proxy target: `http://127.0.0.1:8000`

## One-time server setup on Ubuntu

SSH into the server and inspect the current listeners before taking over `80/443`:

```bash
sudo ss -ltnp | grep -E ':(22|80|443|8080)\b'
```

If another service is already using `80`, you must stop or migrate it before the final cutover. `8080` does not conflict with this repo by itself.

```yaml
ports:
  - "127.0.0.1:8080:80"
```

Then restart the kincare compose stack from `/opt/kincare`:

```bash
docker compose up -d
curl -I http://127.0.0.1:8080
sudo ss -ltnp | grep -E ':(80|443|8080)\b'
```

After this, `8080` should be owned by `docker-proxy` and `80` should be free for the host Nginx. If kincare still needs a public domain, add a separate Nginx `server_name` for it and proxy that domain to `http://127.0.0.1:8080`.

Clone the web repo on the server and run the bootstrap script:

```bash
git clone https://github.com/NanshineLoong/will-it-pop-web.git /tmp/will-it-pop-web
cd /tmp/will-it-pop-web
sudo bash scripts/server/install-web.sh
```

That script will:

- install `nginx`, `certbot`, and `python3-certbot-nginx`
- create `/srv/will-it-pop/web/releases`
- install the Nginx config for `will-it-pop.online`
- create a placeholder page until the first frontend release lands

## GitHub Actions secrets

Create a `production` environment in GitHub for this repository, then add these secrets:

- `DEPLOY_HOST`: `43.156.140.182`
- `DEPLOY_USER`: your SSH user, usually `root` or a sudo-capable deploy user
- `DEPLOY_SSH_PORT`: `22` unless you changed SSH to another port
- `DEPLOY_SSH_PRIVATE_KEY`: the private key GitHub Actions should use
- `SSH_KNOWN_HOSTS`: output of `ssh-keyscan -H will-it-pop.online 43.156.140.182`

If you do not already have a deploy key:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/will-it-pop-actions
cat ~/.ssh/will-it-pop-actions.pub
cat ~/.ssh/will-it-pop-actions
ssh-keyscan -H will-it-pop.online 43.156.140.182
```

- append the public key to the server user's `~/.ssh/authorized_keys`
- store the private key as `DEPLOY_SSH_PRIVATE_KEY`
- store the `ssh-keyscan` output as `SSH_KNOWN_HOSTS`

## First deployment

Push to `main` or trigger the `Deploy Web` workflow manually.

The workflow will:

1. run `npm ci`
2. run `npm test -- --run`
3. run `npm run build`
4. upload the `dist/` bundle to the server
5. activate `/srv/will-it-pop/web/current`
6. reload Nginx

## Enable HTTPS

After the first successful web deployment:

```bash
sudo certbot --nginx -d will-it-pop.online
```

Certbot will update the Nginx config with the `443` server block and automatic redirect.

## Deploying updated note data

When `src/data/xhs_collection/final_notes.json` or `src/data/xhs_collection/images/` changes:

1. commit the updated JSON and image assets in `will-it-pop-web`
2. push to `main`
3. let GitHub Actions rebuild and redeploy the frontend

You do not upload `final_notes.json` or its images separately to the backend.
