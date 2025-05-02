import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware para servir archivos estáticos
app.use(express.static('.'));

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta para apple-app-site-association
app.get('/.well-known/apple-app-site-association', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'apple-app-site-association');
    
    if (!fs.existsSync(filePath)) {
      console.error('Error: apple-app-site-association file not found');
      return res.status(404).json({ error: 'File not found' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(fileContent);
  } catch (error) {
    console.error('Error serving apple-app-site-association:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Ruta de login para prueba de deeplink
app.get('/login', (req, res) => {
  const { email, token } = req.query;
  res.json({ 
    message: 'Login deeplink received',
    data: { email, token }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Test endpoint: http://localhost:3000/test');
  console.log('Deep link test: http://localhost:3000/login?email=test@example.com&token=123');
}); 