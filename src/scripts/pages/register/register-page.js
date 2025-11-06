import { registerUser } from '../../data/api.js';

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <h1>Register</h1>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required aria-describedby="name-help">
            <small id="name-help" class="form-help">Enter your full name.</small>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required aria-describedby="email-help">
            <small id="email-help" class="form-help">Enter a valid email address.</small>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required minlength="8" aria-describedby="password-help">
            <small id="password-help" class="form-help">Password must be at least 8 characters long.</small>
          </div>
          <button type="submit" aria-describedby="register-help">Register</button>
          <small id="register-help" class="form-help">Click to create your account.</small>
        </form>
        <p>Already have an account? <a href="#/login">Login here</a></p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('register-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Form validation
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length < 2) {
        nameInput.setCustomValidity('Name must be at least 2 characters long.');
      } else {
        nameInput.setCustomValidity('');
      }
    });

    emailInput.addEventListener('input', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        emailInput.setCustomValidity('Please enter a valid email address.');
      } else {
        emailInput.setCustomValidity('');
      }
    });

    passwordInput.addEventListener('input', () => {
      if (passwordInput.value.length < 8) {
        passwordInput.setCustomValidity('Password must be at least 8 characters long.');
      } else {
        passwordInput.setCustomValidity('');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');

      if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering...';

      try {
        const result = await registerUser({ name, email, password });
        if (result.error === false) {
          alert('Registration successful! Please login.');
          window.location.hash = '#/login';
        } else {
          alert('Registration failed: ' + result.message);
        }
      } catch (error) {
        alert('Error during registration. Please check your connection and try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
      }
    });
  }
}
