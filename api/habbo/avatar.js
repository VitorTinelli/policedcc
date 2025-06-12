// Endpoint para proxy de imagens do Habbo
const habboProfile = require('../commons/habboProfile');

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { username, size = 'l', headOnly = '0', direction = '4', action = 'std' } = req.query;

    if (!username) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }

    // Lista de URLs do Habbo para tentar
    const habboUrls = [
      'https://www.habbo.com.br/habbo-imaging/avatarimage',
      'https://habbo.com/habbo-imaging/avatarimage',
      'https://images.habbo.com/avatarimage',
      'https://www.habbo.com/habbo-imaging/avatarimage'
    ];

    let imageBuffer = null;
    let lastError = null;

    // Tentar cada URL até encontrar uma que funcione
    for (const baseUrl of habboUrls) {
      try {
        const params = new URLSearchParams({
          user: username,
          action: action,
          direction: direction,
          head_direction: '3',
          img_format: 'png',
          gesture: 'sml',
          headonly: headOnly,
          size: size,
        });

        const imageUrl = `${baseUrl}?${params.toString()}`;
        console.log(`Tentando carregar imagem: ${imageUrl}`);

        const response = await fetch(imageUrl);
        
        if (response.ok) {
          imageBuffer = await response.arrayBuffer();
          console.log(`✅ Imagem carregada com sucesso de: ${baseUrl}`);
          break;
        } else {
          console.log(`❌ Falha ao carregar de ${baseUrl}: ${response.status}`);
        }
      } catch (error) {
        console.log(`💥 Erro ao tentar ${baseUrl}:`, error.message);
        lastError = error;
      }
    }

    if (!imageBuffer) {
      console.log(`💥 Todas as URLs falharam para ${username}`);
      
      // Gerar uma imagem placeholder simples
      const placeholderSvg = `
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" fill="#f0f0f0" stroke="#ddd"/>
          <text x="32" y="25" text-anchor="middle" font-family="Arial" font-size="16">👤</text>
          <text x="32" y="45" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">Avatar</text>
        </svg>
      `;
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=300'); // Cache por 5 minutos
      res.status(200).send(placeholderSvg);
      return;
    }

    // Definir headers para a imagem
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora
    res.setHeader('Content-Length', imageBuffer.byteLength);
    
    // Enviar a imagem
    res.status(200).send(Buffer.from(imageBuffer));

  } catch (error) {
    console.error('Erro no proxy de imagem do Habbo:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Habbo image',
      details: error.message 
    });
  }
}
