# minicards - online flashcards simplified

> minicards is a free, minimal, and open source flashcard web application

Inspired by the best parts of other flashcard programs like [Anki](https://apps.ankiweb.net/) and [Quizlet](https://quizlet.com/), **minicards** is designed and built to bring simplicity back into flashcard software, while still being an incredibly effective method of study and memorization.

## Features

- [x] completely free with no ads
- [x] unlimited flashcard decks
- [x] unlimited flashcards
- [ ] flashcard deck organization (folders, tags, etc.)
- [ ] public and private decks
- [ ] user statistics

## Development

At its core, **minicards** is built with the [T3 stack](https://create.t3.gg/) including these tools:

- **Web Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [daisyUI](https://daisyui.com/), and [headlessUI](https://headlessui.com/)
- **Backend API**: [tRPC](https://trpc.io/) and [Upstash](https://upstash.com/)
- **Database**: [Planetscale](https://planetscale.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

### Prerequisites

To get started contributing to **minicards**, it is assumed you have Node.js installed along with necessary keys from Planetscale, Clerk, and Upstash (see the [`.env.example`](.env.example) file).

### Installation

1. Fork and clone this repository using `git clone`.

2. Install npm packages:
```zsh
npm install
```

3. Create a `.env` file based off of `.env.example`, and provide the necessary keys.
```zsh
DATABASE_URL='mysql://YOUR_MYSQL_URL_HERE?ssl={"rejectUnauthorized":true}'

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_KEY_HERE
CLERK_SECRET_KEY=YOUR_KEY_HERE
UPSTASH_REDIS_REST_URL=YOUR_KEY_HERE
UPSTASH_REDIS_REST_TOKEN=YOUR_KEY_HERE
```

4. Start a local development server.
```zsh
npm run dev
```

### Contributing

1. Make changes on a new branch.
```zsh
git checkout -b my_changes
```

2. Commit and push your changes.
```zsh
git commit -m "My new changes"
git push origin my_changes
```

3. Open a new pull request to merge your branch into the `develop` branch, ***not*** the `main` branch.

## License

Licensed under the GNU General Public License v3.0, Copyright © 2023
