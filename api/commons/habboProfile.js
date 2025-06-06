/**
 * @typedef {Object} HabboProfile
 * @property {string} uniqueId
 * @property {string} name
 * @property {string} figureString
 * @property {string} motto
 * @property {boolean} online
 * @property {string} lastAccessTime
 * @property {string} memberSince
 * @property {boolean} profileVisible
 * @property {number} currentLevel
 * @property {number} currentLevelCompletePercent
 * @property {number} totalExperience
 * @property {number} starGemCount
 * @property {any[]} selectedBadges
 */

/**
 * Busca o perfil de um usuário Habbo
 * @param {string} name - Nome do usuário Habbo
 * @returns {Promise<HabboProfile>} Dados do perfil do usuário
 */
export async function getHabboProfile(name) {
    const url = `https://www.habbo.com.br/api/public/users?name=${encodeURIComponent(name)}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    if (!response.ok) {
        throw new Error(`Erro ao buscar perfil Habbo: ${response.status}`)
    }
    const data = await response.json()
    return data
}