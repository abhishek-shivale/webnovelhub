const API_BASE_URL = "https://api.webnovelhub.online"
export const MEDIA_BASE_URL = API_BASE_URL


export async function fetchHomeData() {
  const response = await fetch(`${API_BASE_URL}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch home data")
  }
  console.log(`${API_BASE_URL}/`, "response home:", await response.json())
  return response.json()
}

export async function fetchGenreData(genre: string) {
  const response = await fetch(`${API_BASE_URL}/${genre}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch genre: ${genre}`)
  }
  console.log(`${API_BASE_URL}/${genre}`, "response genre:", await response.json())
  return response.json()
}

export async function fetchNovelDetails(name: string, all = false) {
  const url = `${API_BASE_URL}/novel-book/${name}${all ? "?all=true" : ""}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch novel: ${name}`)
  }
  console.log(url, "response novel_details:", await response.json())
  return response.json()
}

export async function fetchChapterContent(novelName: string, chapter: string) {
  const response = await fetch(`${API_BASE_URL}/novel-book/${novelName}/${chapter}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch chapter: ${chapter}`)
  }
  console.log(`${API_BASE_URL}/novel-book/${novelName}/${chapter}`, "response chapter:", await response.json())
  return response.json()
}

export async function searchNovels(keyword: string) {
  const response = await fetch(`${API_BASE_URL}/search/${keyword}`)
  if (!response.ok) {
    throw new Error(`Failed to search for: ${keyword}`)
  }
  return response.json()
}

export async function getTTSvoices() {
  const response = await fetch(`${API_BASE_URL}/api/tts/voices`)
  if (!response.ok) {
    throw new Error("Failed to fetch TTS voices")
  }
  return response.json()
}