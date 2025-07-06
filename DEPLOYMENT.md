# Elden Ring Matchmaking - Deployment Guide

## Architecture Overview

**Frontend**: React web app (static files)
**Backend**: Node.js + Socket.IO server (real-time matchmaking)

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

**Backend:**
1. Push code to GitHub
2. Connect Railway to your repo: https://railway.app/
3. Create new project → Deploy from GitHub
4. Railway auto-detects Node.js and runs `npm start`
5. Note the generated URL (e.g., `https://your-app.railway.app`)

**Frontend:**
1. Update `web/.env.production`:
   ```
   REACT_APP_SERVER_URL=https://your-app.railway.app
   ```
2. Build: `cd web && npm run build`
3. Deploy `web/build/` folder to:
   - **Netlify**: Drag & drop the build folder
   - **Vercel**: Connect GitHub repo, set build command to `cd web && npm run build`

### Option 2: Heroku

**Backend:**
1. Create `Procfile` in root:
   ```
   web: node server.js
   ```
2. Deploy:
   ```bash
   heroku create your-app-name
   git add .
   git commit -m "Deploy server"
   git push heroku main
   ```

**Frontend:** Same as Railway option above

### Option 3: DigitalOcean/AWS/GCP

**Backend (VPS/EC2):**
1. SSH into server
2. Install Node.js 16+
3. Clone repo and setup:
   ```bash
   git clone your-repo
   cd your-repo
   cp server-package.json package.json
   npm install
   npm start
   ```
4. Use PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start server.js --name matchmaking
   pm2 startup
   pm2 save
   ```
5. Setup reverse proxy (Nginx):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

**Frontend:** Upload `web/build/` to static hosting or S3+CloudFront

## Environment Variables

**Backend** (server):
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: production

**Frontend** (web app):
- `REACT_APP_SERVER_URL`: Backend URL (e.g., https://your-server.com)

## File Structure for Deployment

```
matchmaking-server/          # Backend only
├── server.js
├── package.json             # Copy from server-package.json
└── node_modules/

matchmaking-web/             # Frontend only  
├── build/                   # Built static files
│   ├── index.html
│   ├── static/
│   └── ...
└── package.json
```

## Testing Production Setup

1. **Local test:**
   ```bash
   # Terminal 1: Start server
   cp server-package.json package.json
   npm install
   npm start

   # Terminal 2: Start web app
   cd web
   npm install
   REACT_APP_SERVER_URL=http://localhost:4000 npm start
   ```

2. **Production test:**
   - Open multiple browser tabs from different devices/networks
   - Test matchmaking across real users

## Scaling Considerations

**For 100+ concurrent users:**
- Use Redis for shared state between server instances
- Add load balancer for multiple server replicas
- Use cluster mode in Node.js

**Enhanced version:**
```javascript
// server.js - Add Redis support
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Store waiting players in Redis instead of memory
// Enable horizontal scaling
```

## Security

**Production checklist:**
- Enable CORS with specific origins only
- Add rate limiting (express-rate-limit)
- Use HTTPS (Let's Encrypt)
- Validate all inputs
- Add basic DDoS protection

## Monitoring

**Health check endpoint:**
```
GET /health
Response: {"status":"ok","waitingPlayers":3,"timestamp":"..."}
```

**Useful metrics:**
- Active connections
- Match success rate  
- Average wait time
- Server response time

## Cost Estimates

**Free tier options:**
- Railway: 500 hours/month free
- Heroku: 1000 dyno hours/month (with credit card)
- Netlify: Unlimited static hosting
- Vercel: 100GB bandwidth/month

**Paid hosting (for serious usage):**
- Railway Pro: $5/month per service
- DigitalOcean: $5/month droplet
- AWS: ~$10-20/month for small setup

## Mobile App Deployment

The React Native app can also connect to the same server:

1. Update `src/services/matchmakingService.ts` to use Socket.IO
2. Build for App Store/Google Play
3. Submit for review

**Note**: Both web and mobile versions can share the same backend server! 