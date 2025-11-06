# Escape Room - Interactive Learning Platform

An interactive escape room learning management system built with Next.js, React, and Bootstrap.

## Features

- 🏰 **Interactive Escape Rooms**: Create and play educational escape room experiences
- ⏰ **Timer System**: Configurable game timers (5, 10, 15 minutes + custom)
- 🧩 **Puzzle System**: Interactive Q&A with key code generation
- 🏆 **Treasure Chest**: Multi-lock treasure chest puzzle
- 🎨 **Modern UI**: Bootstrap-based responsive design
- 🌙 **Theme Support**: Light/dark mode toggle

## Technology Stack

- **Frontend**: Next.js 15+ (App Router), React 19, Bootstrap 5
- **Language**: TypeScript
- **Testing**: Playwright

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Access the application at http://localhost:3000

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test              # Run Playwright tests
npm run test:ui       # Run with UI mode
npm run test:headed   # Run in headed mode
npm run test:debug    # Debug mode
```

## Project Structure

```
escape-room/
├── app/
│   ├── escape-room/    # Main escape room application
│   ├── Components/     # Reusable components (Header, ThemeContext, Footer)
│   └── public/         # Static assets and media
├── tests/              # Playwright tests
└── package.json
```

## Features

- Interactive escape room creation and gameplay
- Timer-based challenges
- Puzzle system with key codes
- Multi-stage treasure chest mechanics
- Responsive design with theme support

## License

This project is licensed under the MIT License.
