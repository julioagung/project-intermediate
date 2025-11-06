import { getStories } from '../data/api.js';
import { getStoriesOffline, getUnsyncedStories } from '../utils/idb.js';

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.stories = [];
    this.offlineStories = [];
    this.activeMarker = null;
  }

  async loadStories() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.view.showLoading();

    try {
      // Load offline stories first
      this.offlineStories = await getStoriesOffline();

      if (navigator.onLine) {
        // Load from API when online
        const data = await getStories({ location: 1 });
        if (data.error === false) {
          // Merge API stories with offline stories (prioritize API data)
          const apiStories = data.listStory;
          const mergedStories = this.#mergeStories(apiStories, this.offlineStories);
          this.stories = mergedStories;
          this.view.displayStories(this.stories);
        } else {
          // Fallback to offline stories if API fails
          this.stories = this.offlineStories;
          this.view.displayStories(this.stories);
          this.view.showError('Failed to load stories from server. Showing cached content.');
        }
      } else {
        // Show offline stories when offline
        this.stories = this.offlineStories;
        this.view.displayStories(this.stories);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      // Fallback to offline stories
      this.stories = this.offlineStories;
      this.view.displayStories(this.stories);
      this.view.showError('Error loading stories. Showing cached content.');
    }
  }

  #mergeStories(apiStories, offlineStories) {
    // Create a map of API stories by ID for quick lookup
    const apiStoriesMap = new Map(apiStories.map(story => [story.id, story]));

    // Start with API stories
    const merged = [...apiStories];

    // Add offline stories that aren't in API (unsynced)
    for (const offlineStory of offlineStories) {
      if (!apiStoriesMap.has(offlineStory.id)) {
        merged.push(offlineStory);
      }
    }

    return merged;
  }

  onStoryClick(id) {
    const story = this.stories.find(s => s.id === id);
    if (story && story.lat && story.lon) {
      this.view.map.setView([story.lat, story.lon], 15);
      if (this.activeMarker) this.view.map.removeLayer(this.activeMarker);
      this.activeMarker = L.marker([story.lat, story.lon]).addTo(this.view.map)
        .bindPopup(`<b>${story.name}</b><br>${story.description}`).openPopup();
    }
  }

  getStories() {
    return this.stories;
  }

  getOfflineStories() {
    return this.offlineStories;
  }
}
