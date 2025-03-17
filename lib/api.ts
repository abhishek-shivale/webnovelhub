import axios from 'axios';

const API_BASE_URL = "https://api.webnovelhub.online";
export const MEDIA_BASE_URL = API_BASE_URL;

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL
});

export async function fetchHomeData() {
  try {
    const response = await api.get('/');
    console.log(`${API_BASE_URL}/`, "response home:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
}

export async function fetchGenreData(genre: string) {
  try {
    const response = await api.get(`/${genre}`);
    console.log(`${API_BASE_URL}/${genre}`, "response genre:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching genre data for ${genre}:`, error);
    throw error;
  }
}

export async function fetchNovelDetails(name: string, all = false) {
  try {
    const url = `/novel-book/${name}${all ? "?all=true" : ""}`;
    const response = await api.get(url);
    console.log(`${API_BASE_URL}${url}`, "response novel_details:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching novel details for ${name}:`, error);
    throw error;
  }
}

export async function fetchChapterContent(novelName: string, chapter: string) {
  try {
    const url = `/novel-book/${novelName}/${chapter}`;
    const response = await api.get(url);
    console.log(`${API_BASE_URL}${url}`, "response chapter:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chapter content for ${novelName}, chapter ${chapter}:`, error);
    throw error;
  }
}

export async function searchNovels(keyword: string) {
  try {
    const response = await api.get(`/search/${keyword}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching for novels with keyword ${keyword}:`, error);
    throw error;
  }
}

export async function getTTSvoices() {
  try {
    const response = await api.get('/api/tts/voices');
    return response.data;
  } catch (error) {
    console.error("Error fetching TTS voices:", error);
    throw error;
  }
}