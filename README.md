This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy to GitHub Pages

This project is set up to deploy as a static site to [GitHub Pages](https://pages.github.com/) using the [official Next.js GitHub Pages flow](https://github.com/nextjs/deploy-github-pages):

1. Push code to the `main` branch.
2. In the repo go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. The workflow runs on every push to `main` and deploys the contents of `out` to GitHub Pages.

Your site will be available at `https://<username>.github.io/devclock/`.

To build locally with the same base path as production:

```bash
PAGES_BASE_PATH=/devclock npm run build
```

### Ticket stats (closed issues)

The page can show how many closed issues **jtarball** and **nbettencourt** have in a GitHub repo (counts are by issue author, fetched at build time).

- **GITHUB_REPO** – Set to the repo to count issues in (e.g. `owner/reponame`). In CI, use **Settings → Secrets and variables → Actions → Variables** and add `GITHUB_REPO`. If unset, the ticket section is hidden.
- **GITHUB_TOKEN** – Optional. In CI this is usually set automatically; you can rely on the default `GITHUB_TOKEN` for higher rate limits. For a private repo, use a token with access.

Numbers are closed issues in that repo, by author.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
