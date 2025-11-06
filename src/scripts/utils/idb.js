import { openDB } from 'idb';

const DB_NAME = 'dicoding-stories-db';
const DB_VERSION = 2;
const FAVORITES_STORE = 'favorites';
const STORIES_STORE = 'stories';
const SYNC_QUEUE_STORE = 'sync-queue';

let dbPromise = null;

export async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Favorites store (existing)
        if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
          const favoritesStore = db.createObjectStore(FAVORITES_STORE, { keyPath: 'id' });
          favoritesStore.createIndex('id', 'id', { unique: true });
        }

        // Stories store for offline storage
        if (!db.objectStoreNames.contains(STORIES_STORE)) {
          const storiesStore = db.createObjectStore(STORIES_STORE, { keyPath: 'id' });
          storiesStore.createIndex('id', 'id', { unique: true });
          storiesStore.createIndex('createdAt', 'createdAt', { unique: false });
          storiesStore.createIndex('synced', 'synced', { unique: false });
        }

        // Sync queue for pending uploads
        if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
          const syncStore = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      },
    });
  }
  return dbPromise;
}

export async function addFavorite(story) {
  const db = await initDB();
  const tx = db.transaction(FAVORITES_STORE, 'readwrite');
  const store = tx.objectStore(FAVORITES_STORE);
  await store.put({ ...story, favoritedAt: new Date().toISOString() });
  await tx.done;
}

export async function removeFavorite(storyId) {
  const db = await initDB();
  const tx = db.transaction(FAVORITES_STORE, 'readwrite');
  const store = tx.objectStore(FAVORITES_STORE);
  await store.delete(storyId);
  await tx.done;
}

export async function getFavorites() {
  const db = await initDB();
  const tx = db.transaction(FAVORITES_STORE, 'readonly');
  const store = tx.objectStore(FAVORITES_STORE);
  const favorites = await store.getAll();
  await tx.done;
  return favorites;
}

export async function isFavorite(storyId) {
  const db = await initDB();
  const tx = db.transaction(FAVORITES_STORE, 'readonly');
  const store = tx.objectStore(FAVORITES_STORE);
  const favorite = await store.get(storyId);
  await tx.done;
  return !!favorite;
}

export async function clearFavorites() {
  const db = await initDB();
  const tx = db.transaction(FAVORITES_STORE, 'readwrite');
  const store = tx.objectStore(FAVORITES_STORE);
  await store.clear();
  await tx.done;
}

// Stories CRUD operations for offline functionality
export async function addStoryOffline(story) {
  const db = await initDB();
  const tx = db.transaction(STORIES_STORE, 'readwrite');
  const store = tx.objectStore(STORIES_STORE);
  const storyWithMeta = {
    ...story,
    id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    synced: false,
    offline: true
  };
  await store.put(storyWithMeta);
  await tx.done;
  return storyWithMeta;
}

export async function getStoriesOffline() {
  const db = await initDB();
  const tx = db.transaction(STORIES_STORE, 'readonly');
  const store = tx.objectStore(STORIES_STORE);
  const stories = await store.getAll();
  await tx.done;
  return stories;
}

export async function getUnsyncedStories() {
  const db = await initDB();
  const tx = db.transaction(STORIES_STORE, 'readonly');
  const store = tx.objectStore(STORIES_STORE);
  const index = store.index('synced');
  const unsyncedStories = await index.getAll(false);
  await tx.done;
  return unsyncedStories;
}

export async function markStorySynced(storyId) {
  const db = await initDB();
  const tx = db.transaction(STORIES_STORE, 'readwrite');
  const store = tx.objectStore(STORIES_STORE);
  const story = await store.get(storyId);
  if (story) {
    story.synced = true;
    await store.put(story);
  }
  await tx.done;
}

export async function deleteStoryOffline(storyId) {
  const db = await initDB();
  const tx = db.transaction(STORIES_STORE, 'readwrite');
  const store = tx.objectStore(STORIES_STORE);
  await store.delete(storyId);
  await tx.done;
}

export async function clearOfflineStories() {
  const db = await initDB();
  const tx = db.transaction(STORIES_STORE, 'readwrite');
  const store = tx.objectStore(STORIES_STORE);
  await store.clear();
  await tx.done;
}

// Sync queue management
export async function addToSyncQueue(item) {
  const db = await initDB();
  const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
  const store = tx.objectStore(SYNC_QUEUE_STORE);
  const queueItem = {
    ...item,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  const id = await store.put(queueItem);
  await tx.done;
  return id;
}

export async function getSyncQueue() {
  const db = await initDB();
  const tx = db.transaction(SYNC_QUEUE_STORE, 'readonly');
  const store = tx.objectStore(SYNC_QUEUE_STORE);
  const queue = await store.getAll();
  await tx.done;
  return queue;
}

export async function removeFromSyncQueue(id) {
  const db = await initDB();
  const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
  const store = tx.objectStore(SYNC_QUEUE_STORE);
  await store.delete(id);
  await tx.done;
}

export async function updateSyncQueueStatus(id, status) {
  const db = await initDB();
  const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
  const store = tx.objectStore(SYNC_QUEUE_STORE);
  const item = await store.get(id);
  if (item) {
    item.status = status;
    item.updatedAt = new Date().toISOString();
    await store.put(item);
  }
  await tx.done;
}

export async function clearSyncQueue() {
  const db = await initDB();
  const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
  const store = tx.objectStore(SYNC_QUEUE_STORE);
  await store.clear();
  await tx.done;
}

// Sync pending stories with API
export async function syncPendingStories() {
  const unsyncedStories = await getUnsyncedStories();
  const syncQueue = await getSyncQueue();

  // Process sync queue first (stories that failed to upload)
  for (const queueItem of syncQueue) {
    if (queueItem.status === 'pending' && queueItem.type === 'story') {
      try {
        const { addStory } = await import('../data/api.js');
        const result = await addStory(queueItem.data);

        if (result.error === false) {
          await markStorySynced(queueItem.storyId);
          await removeFromSyncQueue(queueItem.id);
          await updateSyncQueueStatus(queueItem.id, 'completed');
        } else {
          await updateSyncQueueStatus(queueItem.id, 'failed');
        }
      } catch (error) {
        console.error('Failed to sync story from queue:', error);
        await updateSyncQueueStatus(queueItem.id, 'failed');
      }
    }
  }

  // Process unsynced stories
  for (const story of unsyncedStories) {
    try {
      const { addStory } = await import('../data/api.js');
      const result = await addStory({
        description: story.description,
        photo: story.photo,
        lat: story.lat,
        lon: story.lon
      });

      if (result.error === false) {
        await markStorySynced(story.id);
        // Optionally remove from offline store after successful sync
        // await deleteStoryOffline(story.id);
      } else {
        // Add to sync queue for retry
        await addToSyncQueue({
          type: 'story',
          storyId: story.id,
          data: {
            description: story.description,
            photo: story.photo,
            lat: story.lat,
            lon: story.lon
          }
        });
      }
    } catch (error) {
      console.error('Failed to sync story:', error);
      // Add to sync queue for retry
      await addToSyncQueue({
        type: 'story',
        storyId: story.id,
        data: {
          description: story.description,
          photo: story.photo,
          lat: story.lat,
          lon: story.lon
        }
      });
    }
  }
}
