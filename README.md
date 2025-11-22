# Modern TypeScript Full-Stack Application

A modern full-stack application built with TypeScript, Express.js, and React with Vite.

## 🚀 Features

- **Backend**: Node.js with Express and TypeScript
- **Frontend**: React 18 with TypeScript and Vite
- **Development**: Hot reload for both frontend and backend
- **Production**: Optimized builds and single-port deployment
- **Security**: Helmet, CORS, and input validation
- **Code Quality**: ESLint, TypeScript strict mode

## 📁 Project Structure

```
modern-ts-app/
├── src/
│   └── server.ts         # Backend Express server
├── frontend/
│   └── src/
│       ├── App.tsx       # Main React component
│       ├── main.tsx      # React entry point
│       ├── App.css       # Component styles
│       └── index.css     # Global styles
├── package.json          # Root dependencies & scripts
├── tsconfig.json         # Backend TypeScript config
└── .env                  # Environment variables
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run setup
   ```

   This will install dependencies for both backend and frontend.

2. **Environment Configuration:**
   - Copy `.env.example` to `.env`
   - Update the variables as needed

### Development

**Start both backend and frontend in development mode:**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

**Or run them separately:**
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

The production server will serve both the API and the React app from port 5000.

## 🔧 Available Scripts

### Root Package Scripts
- `npm run dev` - Start both backend and frontend in development
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend server
- `npm run build` - Build both backend and frontend
- `npm run build:backend` - Build only the backend
- `npm run build:frontend` - Build only the frontend
- `npm run start` - Start production server
- `npm run setup` - Install all dependencies
- `npm run type-check` - Check TypeScript types

### Frontend Package Scripts
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

## 🧪 Features Demonstrated

- **Full-Stack TypeScript**: Both frontend and backend use TypeScript
- **API Communication**: React app communicates with Express API
- **Error Handling**: Proper error handling on both client and server
- **Environment Configuration**: Different configs for dev/prod
- **Modern React**: Hooks, functional components, and TypeScript interfaces
- **Express Best Practices**: Middleware, error handling, security headers
- **Development Experience**: Hot reload, TypeScript checking, linting

## 📝 Development Notes

### Backend (src/server.ts)
- Express server with TypeScript
- Middleware for security (helmet), CORS, compression
- RESTful API endpoints
- Error handling middleware
- Serves React app in production

### Frontend (frontend/src/)
- React 18 with TypeScript
- Vite for fast development and building
- Axios for API communication
- Responsive design with CSS Grid/Flexbox
- Environment-based API URL configuration

## 🚀 Deployment

This application can be deployed to:
- **Heroku**: Add a `Procfile` with `web: npm start`
- **Railway**: Works out of the box
- **DigitalOcean App Platform**: Use the provided `package.json` scripts
- **AWS/Azure/GCP**: Configure with Docker or direct Node.js deployment

## 📄 License

MIT License - feel free to use this project as a starting point for your applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---
     Thank You!
Built with ❤️ using TypeScript, Express, React, and modern development tools.
