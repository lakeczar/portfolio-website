# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and TailwindCSS.

<details><summary>Table of Contents</summary>

* [🚀 Technologies](#-technologies)
* [📋 Prerequisites](#-prerequisites)
* [🐳 Docker Setup](#-Docker_Setup)
* [📦 Build Information](#-Build_Information)
* [🔄 Continuous Integration](#-Continuous_Integration)
* [🛠️ Installation & Setup](#-Installation--Setup)
  * [Local Development](#-Local-Development)
  * [Docker Development Environment](#-Docker-Development-Environment)
* [📝 Available Scripts](#-Available-Scripts)
* [Testing](#-Testing)
  * [Unit Testing](#-Unit-Testing)
  * [Docker Build Testing](#-Docker-Build-Testing)
* [📄 License](#-License)

</details>

## 🚀 Technologies

- **Frontend**: React 19, TypeScript, TailwindCSS 4
- **Routing**: TanStack Router
- **State Management**: Zustand
- **UI Components**: Headless UI, Radix UI Themes
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Motion
- **Development**: Vite, ESLint, Prettier
- **Testing**: Vitest, Testing Library, Playwright
- **Component Development**: Storybook
- **Containerization**: Docker

## 📋 Prerequisites

- Node.js 22 or higher
- npm
- Docker and Docker Compose (for containerized development)

## 🐳 Docker Setup

The project includes a multi-stage Dockerfile that supports:

1. **Development**: Hot-reloading for both the app and Storybook
2. **Build**: Creates optimized builds for both the app and Storybook
3. **Production**: Serves the built app and Storybook

## 📦 Build Information

The project uses Vite for fast builds and React Compiler (formerly React Forget) for optimized rendering.

## 🔄 Continuous Integration

The project is set up with:
- ESLint and Prettier for code quality
- Husky and lint-staged for pre-commit hooks
- Storybook with Chromatic for visual testing

## 🛠️ Installation & Setup

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd portfolio-website

# Install dependencies
npm install

# Start the development server
npm run dev

# Start Storybook
npm run storybook
```

### Docker Development Environment

```bash
# Start the development environment
docker-compose up frontend

# The app will be available at http://localhost:5173
# Storybook will be available at http://localhost:6006
```

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview the production build locally
- `npm run storybook` - Start Storybook for component development
- `npm run build-storybook` - Build Storybook for production
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests with Playwright
- 
## Testing

### Unit Testing

### Docker Build Testing

```bash
# Test the development build
docker build --target=development -t portfolio-website:dev .

# Run linting in the container
docker run --rm portfolio-website:dev npm run lint

# Test the production build with GitHub Pages arguments
docker build --target=build \
  --build-arg BUILD_COMMAND="npm run build:github" \
  --build-arg STORYBOOK_BUILD_COMMAND="npm run build-storybook -- --ci" \
  -t portfolio-website:build .

# Create a temporary container and extract files
docker create --name temp portfolio-website:build
docker cp temp:/app/dist ./dist-test
docker cp temp:/app/storybook-static ./storybook-test
docker rm temp

# Check that the files were extracted correctly
ls -la ./dist-test
ls -la ./storybook-test
```

```bash
# Install serve if you don't have it
npm install -g serve

# Serve the built files
cd dist-test
serve -s -l 5000

# In another terminal
cd storybook-test
serve -l 6006
```
Visit http://localhost:5000 and http://localhost:6006 to ensure everything loads correctly.

## 📄 License

[MIT](LICENSE)
