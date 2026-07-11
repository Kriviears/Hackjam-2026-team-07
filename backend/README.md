# Backend (`/backend`)

The backend is a Node.js / Express API that connects to MongoDB and to the Mistral AI API  

## Create your local environment file (never commit this file)
.env

then fill in MISTRAL_API_KEY, MONGO_URI, PORT

MISTRAL_API_KEY - API key from https://console.mistral.ai/
MONGO_URI- MongoDB connection string
PORT - Port the server listens on (default `5000`)
JWT_SECRET - Secret used to sign auth tokens 

```bash
cd backend
npm install
npm run dev   # nodemon, auto-restarts on changes
# or
npm start
```
