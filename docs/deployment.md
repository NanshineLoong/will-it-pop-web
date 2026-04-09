# Deployment

This project includes an opinionated self-hosting workflow for serving the Vite build behind Nginx and proxying `/api` traffic to a backend service running on the same host.

## What is included

- `.github/workflows/deploy-web.yml`: CI workflow that installs dependencies, runs tests, builds the frontend, uploads the build artifact, and activates a new release on the server.
- `scripts/server/install-web.sh`: one-time server bootstrap script that installs Nginx and Certbot, creates the release directories, and enables the Nginx site.
- `scripts/server/deploy-web.sh`: release activation script used by the GitHub Actions workflow.
- `ops/nginx/will-it-pop.conf`: Nginx site template for serving the frontend and proxying `/api`.

If you want to keep the built-in self-hosting workflow, `ops/` and `scripts/` are still necessary because the deployment workflow depends on them.

## Deployment model

The included scripts assume:

- a Linux server with `nginx` installed
- a frontend release directory such as `/srv/<app-name>/web/releases`
- a stable symlink such as `/srv/<app-name>/web/current`
- a backend service reachable at `http://127.0.0.1:8000`
- Nginx serving the frontend from the `current` symlink and proxying `/api` to the backend

Each deployment uploads a tarball of `dist/`, extracts it into a new release directory, repoints the `current` symlink, and reloads Nginx.

## 1. Prepare the server

Clone the repository on the server and run the bootstrap script:

```bash
git clone <your-repo-url> /tmp/will-it-pop-web
cd /tmp/will-it-pop-web
sudo bash scripts/server/install-web.sh
```

The script will:

- install `nginx`, `certbot`, and `python3-certbot-nginx`
- create the release directory structure
- install the Nginx site config from `ops/nginx/will-it-pop.conf`
- create a placeholder site until the first release is deployed

Before using the provided Nginx config, update it for your environment:

- replace `server_name will-it-pop.online` with your domain
- replace `/srv/will-it-pop/web/current` with your desired deploy path if needed
- replace the backend upstream if your API is not on `127.0.0.1:8000`

File to edit: `ops/nginx/will-it-pop.conf`

## 2. Configure GitHub Actions secrets

Create a `production` environment in GitHub and add these secrets:

- `DEPLOY_HOST`: your server hostname or IP
- `DEPLOY_USER`: the SSH user used for deployment
- `DEPLOY_SSH_PORT`: optional, defaults to `22`
- `DEPLOY_SSH_PRIVATE_KEY`: private key used by GitHub Actions
- `SSH_KNOWN_HOSTS`: output from `ssh-keyscan -H <your-host>`

Example commands:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/will-it-pop-actions
cat ~/.ssh/will-it-pop-actions.pub
cat ~/.ssh/will-it-pop-actions
ssh-keyscan -H <your-domain-or-host>
```

Then:

- append the public key to the deploy user's `~/.ssh/authorized_keys`
- store the private key as `DEPLOY_SSH_PRIVATE_KEY`
- store the `ssh-keyscan` output as `SSH_KNOWN_HOSTS`

## 3. Deploy

Push to `main` or trigger the `Deploy Web` workflow manually.

The workflow will:

1. run `npm ci`
2. run `npm test -- --run`
3. run `npm run build`
4. package `dist/` as a tarball
5. upload the tarball and deployment script to the server
6. extract the new release and repoint the `current` symlink
7. reload Nginx

Workflow file: `.github/workflows/deploy-web.yml`

## 4. Enable HTTPS

After the first successful deployment, request a certificate for your domain:

```bash
sudo certbot --nginx -d <your-domain>
```

Certbot will update the Nginx config with the TLS server block and redirect rules.

## Notes for this project

- Frontend API requests stay relative to `/api`, so the browser talks to the same origin as the frontend build.
- Static note data under `src/data/xhs_collection/` is bundled into the frontend build. Updating that data only requires a new frontend deployment.

## If you do not want this workflow

If you deploy this app using another platform such as Vercel, Netlify, or a different custom setup, you can remove or replace:

- `.github/workflows/deploy-web.yml`
- `scripts/server/install-web.sh`
- `scripts/server/deploy-web.sh`
- `ops/nginx/will-it-pop.conf`
