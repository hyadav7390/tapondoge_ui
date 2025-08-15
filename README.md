# Tap on Doge UI

A modern React-based UI for the Tap on Doge platform, built with Next.js and TailwindCSS.

## Features

- Wallet connection and management
- Token listing with pagination
- Token balance checking
- Token inscription (mint, deploy, transfer)
- DMT token support
- Recent token deployments
- Transaction history
- Price tracking with DOGE/USD conversion

## Prerequisites

- Node.js 18.x or later
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tapondoge_ui.git
cd tapondoge_ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following content:
```env
NEXT_PUBLIC_API_URL=https://api.tapondoge.com
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── components/     # React components
├── contexts/      # React contexts
├── pages/         # Next.js pages
├── services/      # API services
├── styles/        # Global styles and CSS modules
├── utils/         # Utility functions
└── types/         # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- [Bitcore](https://bitcore.io/) - Bitcoin/Dogecoin library
- [Axios](https://axios-http.com/) - HTTP client
- [FontAwesome](https://fontawesome.com/) - Icons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
