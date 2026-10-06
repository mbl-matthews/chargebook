![chargebook](./public/chargebook.png)

# Chargebook

A minimalistic logbook-like tracking tool for your EV charges.

# Background

The idea came from the need to manage multiple mainly private places of charging an Electric Vehicle to keep track of the charged amount of electricity. A central app
gives the opportunity to access the data from any of the charging points.

# Function

Among the few functionalities is the main one: Register a done charge with the charged amount and the date. By holding onto an entry you enter selectmode to select one to many
entries to account them. By clicking the save button the charges can be posted to a certain date, to mark them as paid. The dialog gives the option to set a price per kWh. 
This data does not get stored. It is simply displayed so you know what you owe for the selected charges at the given price point.
A charge must be recorded to an existing creditor which can be managed separately.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
