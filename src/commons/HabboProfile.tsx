/**
 * Interface para o perfil do Habbo
 */
export interface HabboProfile {
  uniqueId: string
  name: string
  figureString: string
  motto: string
  online: boolean
  lastAccessTime: string
  memberSince: string
  profileVisible: boolean
  currentLevel: number
  currentLevelCompletePercent: number
  totalExperience: number
  starGemCount: number
  selectedBadges: any[]
}

/**
 * Busca o perfil de um usuário Habbo diretamente da API pública
 * @param name - Nome do usuário Habbo
 * @returns Dados do perfil do usuário
 */
export async function getHabboProfile(name: string): Promise<HabboProfile> {
    if (!name || typeof name !== 'string' || !name.trim()) {
        throw new Error('Nome é obrigatório')
    }

    const urls = [
        `https://www.habbo.com.br/api/public/users?name=${encodeURIComponent(name)}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.habbo.com.br/api/public/users?name=${encodeURIComponent(name)}`)}`
    ]

    let lastError: Error | null = null

    for (let i = 0; i < urls.length; i++) {
        try {
            const response = await fetch(urls[i], {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            let data = await response.json()
            
            if (i === 1 && data.contents) {
                data = JSON.parse(data.contents)
            }

            if (!data || typeof data !== 'object') {
                throw new Error('Dados inválidos recebidos da API')
            }

            return data as HabboProfile

        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error))
            console.warn(`Tentativa ${i + 1} falhou:`, lastError.message)
            
            if (i < urls.length - 1) {
                continue
            }
        }
    }

    throw new Error(`Erro ao buscar perfil Habbo para "${name}": ${lastError?.message || 'Erro desconhecido'}`)
}