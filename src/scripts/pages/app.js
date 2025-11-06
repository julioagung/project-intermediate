import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // Check auth for protected routes
    if ((url === '/' || url === '/add') && !localStorage.getItem('token')) {
      window.location.hash = '#/login';
      return;
    }

    // Use View Transition API for smooth page transitions
    if (!document.startViewTransition) {
      // Fallback for browsers without View Transition API
      this.#content.style.opacity = '0';
      setTimeout(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
        this.#content.style.opacity = '1';
      }, 300);
    } else {
      const transition = document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    }

    // Update page title for accessibility
    const pageTitles = {
      '/': 'Home - Dicoding Stories',
      '/add': 'Add Story - Dicoding Stories',
      '/login': 'Login - Dicoding Stories',
      '/register': 'Register - Dicoding Stories',
      '/about': 'About - Dicoding Stories'
    };
    document.title = pageTitles[url] || 'Dicoding Stories';

    // Update navigation based on auth status
    this.#updateNavigation();

    // Request push notification permission on first load
    this.#requestNotificationPermission();
  }

  async #requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      // Show a more user-friendly permission request
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
        // Show success feedback
        this.#showNotificationFeedback('Notifications enabled! 🎉', 'success');
        // Subscribe to push notifications
        this.#subscribeToPushNotifications();
      } else {
        console.log('Notification permission denied');
        // Show denial feedback
        this.#showNotificationFeedback('Notifications denied. You can enable them later in browser settings.', 'warning');
        // Reset toggle
        const toggle = document.getElementById('notification-toggle');
        if (toggle) toggle.checked = false;
      }
    }
  }

  #showNotificationFeedback(message, type) {
    // Create a temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = `notification-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: var(--border-radius-lg);
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s;
      box-shadow: var(--shadow-lg);
    `;

    if (type === 'success') {
      feedback.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else if (type === 'warning') {
      feedback.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    } else {
      feedback.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    }

    document.body.appendChild(feedback);

    // Remove after animation
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 3500);
  }

  async #unsubscribeFromPushNotifications() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Push subscription unsubscribed');
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  }

  async #subscribeToPushNotifications() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.#urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY)
      });

      console.log('Push subscription:', subscription);

      // Here you would typically send the subscription to your backend
      // For demo purposes, we'll just log it
      // await sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  }

  #urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  #updateNavigation() {
    const navList = document.getElementById('nav-list');
    const isLoggedIn = !!localStorage.getItem('token');

    const navItems = [
      { href: '#/', text: 'Home' },
      { href: '#/add', text: 'Add Story' },
      { href: '#/about', text: 'About' }
    ];

    if (!isLoggedIn) {
      navItems.push(
        { href: '#/login', text: 'Login' },
        { href: '#/register', text: 'Register' }
      );
    } else {
      navItems.push({ href: '#logout', text: 'Logout', id: 'logout-link' });
    }

    navList.innerHTML = navItems.map(item =>
      `<li><a href="${item.href}" ${item.id ? `id="${item.id}"` : ''}>${item.text}</a></li>`
    ).join('');

    // Add notification toggle for logged-in users
    if (isLoggedIn) {
      this.#addNotificationToggle();
    }

    // Add logout event listener
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        window.location.hash = '#/login';
        // Update navigation immediately after logout
        this.#updateNavigation();
      });
    }
  }

  async #addNotificationToggle() {
    const navList = document.getElementById('nav-list');
    const existingToggle = document.getElementById('notification-toggle-container');

    if (existingToggle) return; // Already added

    const toggleLi = document.createElement('li');
    toggleLi.id = 'notification-toggle-container';
    toggleLi.innerHTML = `
      <div class="notification-toggle-wrapper">
        <label for="notification-toggle" class="notification-toggle-label">
          <div class="toggle-switch">
            <input type="checkbox" id="notification-toggle" class="toggle-input">
            <span class="toggle-slider"></span>
          </div>
          <div class="toggle-content">
            <span class="toggle-icon">🔔</span>
            <span class="toggle-text">Push Notifications</span>
            <span class="toggle-status" id="notification-status"></span>
          </div>
        </label>
      </div>
    `;

    navList.appendChild(toggleLi);

    const toggle = document.getElementById('notification-toggle');
    const statusEl = document.getElementById('notification-status');

    // Check current subscription status
    if ('serviceWorker' in navigator && 'pushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        toggle.checked = !!subscription;
        this.#updateToggleStatus(statusEl, !!subscription);
      } catch (error) {
        console.error('Error checking subscription status:', error);
        this.#updateToggleStatus(statusEl, false);
      }
    }

    toggle.addEventListener('change', async () => {
      const isChecked = toggle.checked;
      statusEl.textContent = isChecked ? 'Enabling...' : 'Disabling...';
      statusEl.className = 'toggle-status loading';

      try {
        if (isChecked) {
          await this.#requestNotificationPermission();
        } else {
          await this.#unsubscribeFromPushNotifications();
        }

        // Update status after action
        this.#updateToggleStatus(statusEl, isChecked);
      } catch (error) {
        console.error('Error updating notification subscription:', error);
        // Revert toggle on error
        toggle.checked = !isChecked;
        this.#updateToggleStatus(statusEl, !isChecked);
      }
    });

    // Add install prompt functionality
    this.#addInstallPrompt();
  }

  async #addInstallPrompt() {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return; // Already installed
    }

    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;

      // Show install button
      this.#showInstallButton(deferredPrompt);
    });

    // Check if app was installed
    window.addEventListener('appinstalled', (evt) => {
      console.log('App was installed successfully');
      // Hide install button
      const installBtn = document.getElementById('install-button');
      if (installBtn) installBtn.style.display = 'none';
    });
  }

  #showInstallButton(deferredPrompt) {
    const navList = document.getElementById('nav-list');
    const existingBtn = document.getElementById('install-button-container');

    if (existingBtn) return; // Already added

    const installLi = document.createElement('li');
    installLi.id = 'install-button-container';
    installLi.innerHTML = `
      <button id="install-button" class="install-button">
        <span class="install-icon">📱</span>
        <span class="install-text">Install App</span>
      </button>
    `;

    navList.appendChild(installLi);

    const installBtn = document.getElementById('install-button');
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }

        // Clear the deferred prompt
        deferredPrompt = null;

        // Hide the install button
        installBtn.style.display = 'none';
      }
    });
  }

  #updateToggleStatus(statusEl, isEnabled) {
    if (isEnabled) {
      statusEl.textContent = 'Enabled';
      statusEl.className = 'toggle-status enabled';
    } else {
      statusEl.textContent = 'Disabled';
      statusEl.className = 'toggle-status disabled';
    }
  }
}

export default App;
