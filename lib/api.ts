const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8787"
export const MEDIA_BASE_URL = API_BASE_URL


export async function fetchHomeData() {
  const response = await fetch(`${API_BASE_URL}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch home data")
  }
  return response.json()
}

export async function fetchGenreData(genre: string) {
  const response = await fetch(`${API_BASE_URL}/${genre}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch genre: ${genre}`)
  }
  return response.json()
}

export async function fetchNovelDetails(name: string, all = false) {
  const url = `${API_BASE_URL}/novel-book/${name}${all ? "?all=true" : ""}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch novel: ${name}`)
  }
  return response.json()
}

export async function fetchChapterContent(novelName: string, chapter: string) {
  const response = await fetch(`${API_BASE_URL}/novel-book/${novelName}/${chapter}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch chapter: ${chapter}`)
  }
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