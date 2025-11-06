import HomePresenter from '../../presenters/home-presenter.js';
import { addFavorite, removeFavorite, getFavorites, isFavorite } from '../../utils/idb.js';

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter(this);
    this.map = null;
    this.markers = [];
    this.favorites = [];
  }

  async render() {
    const token = localStorage.getItem('token');
    if (!token) {
      return `
        <section class="container">
          <h1>Dicoding Stories</h1>
          <p>Please <a href="#/login">login</a> to view stories.</p>
        </section>
      `;
    }

    return `
      <section class="container">
        <h1>Dicoding Stories</h1>
        <div class="filter-section">
          <label for="location-filter">Filter by Location:</label>
          <select id="location-filter">
            <option value="all">All Stories</option>
            <option value="with-location">With Location</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>
        <div class="content-wrapper">
          <div id="story-list" class="story-list"></div>
          <div id="map" class="map-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const mapElement = document.getElementById('map');
    const listElement = document.getElementById('story-list');
    const filterElement = document.getElementById('location-filter');

    // Check if we're offline and show appropriate message
    this.#checkOnlineStatus();

    // Initialize map with multiple tile layers
    this.map = L.map('map').setView([-6.2, 106.816666], 10);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const baseLayers = {
      "OpenStreetMap": osmLayer,
      "Satellite": satelliteLayer
    };

    osmLayer.addTo(this.map);
    L.control.layers(baseLayers).addTo(this.map);

    // Load stories and favorites
    await this.presenter.loadStories();
    await this.loadFavorites();

    // Sync list and map
    listElement.addEventListener('click', async (e) => {
      const storyItem = e.target.closest('.story-item');
      if (storyItem) {
        const id = storyItem.dataset.id;
        if (e.target.classList.contains('favorite-btn')) {
          await this.toggleFavorite(id);
        } else {
          this.presenter.onStoryClick(id);
        }
      }
    });

    // Filter functionality
    filterElement.addEventListener('change', () => {
      const filteredStories = this.filterStories(filterElement.value);
      this.displayStories(filteredStories);
    });

    // Listen for online/offline events
    window.addEventListener('online', () => this.#handleOnlineStatus());
    window.addEventListener('offline', () => this.#handleOfflineStatus());

    // Update sync status periodically when offline
    setInterval(() => {
      if (!navigator.onLine) {
        this.#updateSyncStatus();
      }
    }, 5000); // Update every 5 seconds
  }

  #checkOnlineStatus() {
    if (!navigator.onLine) {
      this.#showOfflineMessage();
    }
  }

  #handleOnlineStatus() {
    console.log('Back online');
    // Sync pending stories first
    this.#syncPendingStories();
    // Reload stories when coming back online
    this.presenter.loadStories();
    this.#hideOfflineMessage();
  }

  #handleOfflineStatus() {
    console.log('Gone offline');
    this.#showOfflineMessage();
  }

  #showOfflineMessage() {
    const container = document.querySelector('.container');
    if (document.getElementById('offline-message')) return;

    const offlineMsg = document.createElement('div');
    offlineMsg.id = 'offline-message';
    offlineMsg.className = 'offline-message';
    offlineMsg.innerHTML = `
      <div class="offline-content">
        <span class="offline-icon">📴</span>
        <div class="offline-text">
          <strong>You're offline</strong>
          <p>Some features may be limited. Cached content is available.</p>
          <div id="sync-status" class="sync-status-info">
            <span id="sync-count">Checking pending items...</span>
            <button id="manual-sync-btn" class="manual-sync-btn" style="display: none;">Sync Now</button>
          </div>
        </div>
      </div>
    `;
    container.insertBefore(offlineMsg, container.firstChild);

    // Update sync status
    this.#updateSyncStatus();
  }

  #hideOfflineMessage() {
    const offlineMsg = document.getElementById('offline-message');
    if (offlineMsg) {
      offlineMsg.remove();
    }
  }

  async #syncPendingStories() {
    try {
      const { syncPendingStories } = await import('../../utils/idb.js');
      await syncPendingStories();
      console.log('Pending stories synced successfully');
    } catch (error) {
      console.error('Failed to sync pending stories:', error);
    }
  }

  async #updateSyncStatus() {
    try {
      const { getSyncQueue, getUnsyncedStories } = await import('../../utils/idb.js');
      const syncQueue = await getSyncQueue();
      const unsyncedStories = await getUnsyncedStories();

      const totalPending = syncQueue.length + unsyncedStories.length;
      const syncCountElement = document.getElementById('sync-count');
      const manualSyncBtn = document.getElementById('manual-sync-btn');

      if (syncCountElement) {
        if (totalPending > 0) {
          syncCountElement.textContent = `${totalPending} item${totalPending > 1 ? 's' : ''} pending sync`;
          if (manualSyncBtn) {
            manualSyncBtn.style.display = 'inline-block';
            manualSyncBtn.onclick = () => this.#syncPendingStories();
          }
        } else {
          syncCountElement.textContent = 'All items synced';
          if (manualSyncBtn) {
            manualSyncBtn.style.display = 'none';
          }
        }
      }
    } catch (error) {
      console.error('Failed to update sync status:', error);
    }
  }

  showLoading() {
    const listElement = document.getElementById('story-list');
    listElement.innerHTML = '<div class="loading">Loading stories...</div>';
  }

  showError(message) {
    const listElement = document.getElementById('story-list');
    listElement.innerHTML = `<div class="error">${message}</div>`;
  }

  displayStories(stories) {
    const listElement = document.getElementById('story-list');

    // Clear existing markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers.length = 0;

    // Display list
    listElement.innerHTML = stories.map(story => {
      const isOffline = story.offline || story.id.startsWith('offline-');
      const syncStatus = isOffline ? '<span class="sync-status">⏳ Pending sync</span>' : '';
      const photoUrl = story.photoUrl || (story.photo instanceof File ? URL.createObjectURL(story.photo) : '');

      return `
        <div class="story-item ${isOffline ? 'offline-story' : ''}" data-id="${story.id}" tabindex="0">
          <img src="${photoUrl}" alt="${story.name} story image" loading="lazy">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <p>${new Date(story.createdAt).toLocaleDateString()}</p>
          ${syncStatus}
          <button class="favorite-btn ${this.isStoryFavorited(story.id) ? 'favorited' : ''}" aria-label="Toggle favorite">
            ${this.isStoryFavorited(story.id) ? '❤️' : '🤍'}
          </button>
        </div>
      `;
    }).join('');

    // Add markers for stories with location
    stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon])
          .addTo(this.map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
        this.markers.push(marker);
      }
    });
  }

  filterStories(filter) {
    if (filter === 'with-location') {
      return this.presenter.getStories().filter(story => story.lat && story.lon);
    } else if (filter === 'favorites') {
      return this.favorites;
    }
    return this.presenter.getStories();
  }

  async loadFavorites() {
    try {
      this.favorites = await getFavorites();
    } catch (error) {
      console.error('Failed to load favorites:', error);
      this.favorites = [];
    }
  }

  async toggleFavorite(storyId) {
    try {
      const story = this.presenter.getStories().find(s => s.id === storyId);
      if (!story) return;

      const isFavorited = await isFavorite(storyId);
      if (isFavorited) {
        await removeFavorite(storyId);
        this.favorites = this.favorites.filter(fav => fav.id !== storyId);
      } else {
        await addFavorite(story);
        this.favorites.push(story);
      }

      // Update UI
      const currentFilter = document.getElementById('location-filter').value;
      const filteredStories = this.filterStories(currentFilter);
      this.displayStories(filteredStories);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }

  isStoryFavorited(storyId) {
    return this.favorites.some(fav => fav.id === storyId);
  }
}
