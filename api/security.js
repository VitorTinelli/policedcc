export function withAuth(handler) {
  return async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
      res.status(200).end()
      return
    }

    const expectedApiKey = process.env.API_SECRET_KEY

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
    ].filter(Boolean)

    const origin = req.headers.origin
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }

    const referer = req.headers.referer
    const isValidOrigin = origin && allowedOrigins.some(allowed => origin === allowed) ||
                         referer && allowedOrigins.some(allowed => referer.startsWith(allowed))

    if (!isValidOrigin) {
      res.status(403).json({ error: 'Acesso não autorizado.' })
      return
    }

    const apiKey = req.headers['authorization']
    
    if (!apiKey || apiKey !== expectedApiKey) {
      console.error('Acesso não autorizado: API Key inválida ou ausente')
      console.log('API Key recebida:', apiKey)
      console.log('API Key esperada:', expectedApiKey)
      res.status(401).json({ error: 'Acesso não autorizado.' })
      return
    }

    return handler(req, res)
  }
}