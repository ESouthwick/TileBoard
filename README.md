# TileBoard

A web-based interactive tile board application built with React, Konva, and Material-UI. Deployed at [https://esouthwick.github.io/TileBoard/](https://esouthwick.github.io/TileBoard/).

## Features

- Interactive canvas for creating and manipulating tiles using [Konva](https://konvajs.org/).
- Modern UI components powered by [Material-UI](https://mui.com/).
- Responsive design with React and Emotion for styling.
- Deployed via GitHub Pages.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
 ```bash
git clone https://github.com/esouthwick/TileBoard.git
cd TileBoard
  ```
2. Install dependencies:
  ```bash
npm install
  ```

### Available Scripts
In the project directory, you can run:
npm run dev: Runs the app in development mode. Open http://localhost:5173 to view it in the browser.

npm run build: Builds the app for production to the dist folder.

npm run deploy: Deploys the built app to GitHub Pages.

### Project Structure
```├── src/
├── components/
│   ├── board.tsx 
│   ├── inputs.tsx 
│   └── table.tsx 
└── app.tsx             
```

### Dependencies
React & React DOM (^19.0.0): Core libraries for building the UI.

Konva (^9.3.18) & React-Konva (^19.0.3): For canvas-based tile interactions.

Material-UI (^6.4.6): UI components and icons.

Emotion (^11.14.0): Styled components and CSS-in-JS.

### Dev Dependencies
Vite (^6.2.0): Fast development server and build tool.

TypeScript (~5.7.2): Static typing for JavaScript.

ESLint (^9.21.0): Linting for code quality.

gh-pages (^6.3.0): For deploying to GitHub Pages.

### Acknowledgments
Built with Vite for a fast development experience.

Powered by Konva for canvas rendering.

Styled with Material-UI and Emotion.

