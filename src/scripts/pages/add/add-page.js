import { addStory } from '../../data/api.js';
import { addStoryOffline, addToSyncQueue } from '../../utils/idb.js';

export default class AddPage {
  async render() {
    return `
      <section class="container">
        <h1>Add New Story</h1>
        <form id="add-form" enctype="multipart/form-data">
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" required aria-describedby="description-help"></textarea>
            <small id="description-help" class="form-help">Describe your story in detail.</small>
          </div>
          <div class="form-group">
            <label for="photo">Photo:</label>
            <input type="file" id="photo" name="photo" accept="image/*" required aria-describedby="photo-help">
            <small id="photo-help" class="form-help">Upload an image or use your camera.</small>
            <button type="button" id="camera-btn" aria-label="Use camera to take photo">Use Camera</button>
          </div>
          <div class="form-group">
            <label for="map">Click on map to set location (optional):</label>
            <div id="map" style="height: 300px;" role="application" aria-label="Map for selecting location"></div>
            <input type="hidden" id="lat" name="lat" aria-hidden="true">
            <input type="hidden" id="lon" name="lon" aria-hidden="true">
          </div>
          <button type="submit" aria-describedby="submit-help">Add Story</button>
          <small id="submit-help" class="form-help">Submit your story to share with others.</small>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('add-form');
    const mapElement = document.getElementById('map');
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');
    const cameraBtn = document.getElementById('camera-btn');
    const descriptionInput = document.getElementById('description');
    const photoInput = document.getElementById('photo');

    // Initialize map
    const map = L.map('map').setView([-6.2, 106.816666], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let marker;
    map.on('click', (e) => {
      if (marker) map.removeLayer(marker);
      marker = L.marker(e.latlng).addTo(map);
      latInput.value = e.latlng.lat;
      lonInput.value = e.latlng.lng;
    });

    // Form validation
    descriptionInput.addEventListener('input', () => {
      if (descriptionInput.value.trim().length < 10) {
        descriptionInput.setCustomValidity('Description must be at least 10 characters long.');
      } else {
        descriptionInput.setCustomValidity('');
      }
    });

    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (file && file.size > 1024 * 1024) { // 1MB limit
        photoInput.setCustomValidity('File size must be less than 1MB.');
        alert('File size must be less than 1MB.');
      } else {
        photoInput.setCustomValidity('');
      }
    });

    // Camera functionality
    cameraBtn.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.style.display = 'none';
        document.body.appendChild(video);
        video.play();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 480;

        // Show preview
        const previewContainer = document.createElement('div');
        previewContainer.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 20px; border-radius: 10px;">
              <video id="camera-preview" autoplay style="width: 100%; max-width: 400px;"></video>
              <br><br>
              <button id="capture-btn">Capture</button>
              <button id="cancel-btn">Cancel</button>
            </div>
          </div>
        `;
        document.body.appendChild(previewContainer);

        const previewVideo = document.getElementById('camera-preview');
        previewVideo.srcObject = stream;

        document.getElementById('capture-btn').addEventListener('click', () => {
          ctx.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            const file = new File([blob], 'camera.jpg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            photoInput.files = dataTransfer.files;
          });
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(previewContainer);
          document.body.removeChild(video);
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(previewContainer);
          document.body.removeChild(video);
        });

      } catch (error) {
        alert('Camera access denied or not supported.');
      }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');

      const description = formData.get('description');
      const photo = formData.get('photo');
      const lat = latInput.value ? parseFloat(latInput.value) : undefined;
      const lon = lonInput.value ? parseFloat(lonInput.value) : undefined;

      if (!description || !photo) {
        alert('Please fill in all required fields.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Adding story...';

      // Check if online
      if (!navigator.onLine) {
        // Save offline
        try {
          const offlineStory = await addStoryOffline({
            description,
            photo,
            lat,
            lon,
            name: localStorage.getItem('name') || 'Anonymous'
          });

          // Add to sync queue for when connection is restored
          await addToSyncQueue({
            type: 'story',
            storyId: offlineStory.id,
            data: { description, photo, lat, lon }
          });

          alert('Story saved offline! It will be uploaded when you\'re back online.');
          window.location.hash = '#/';
        } catch (error) {
          console.error('Failed to save story offline:', error);
          alert('Failed to save story offline. Please try again.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Add Story';
        }
        return;
      }

      // Online submission
      try {
        const result = await addStory({ description, photo, lat, lon });
        if (result.error === false) {
          alert('Story added successfully!');
          window.location.hash = '#/';
        } else {
          alert('Failed to add story: ' + result.message);
        }
      } catch (error) {
        alert('Error adding story. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Story';
      }
    });
  }
}
