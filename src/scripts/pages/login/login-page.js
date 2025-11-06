import { loginUser } from '../../data/api.js';

export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <h1>Login</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required aria-describedby="email-help">
            <small id="email-help" class="form-help">Enter your registered email address.</small>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required aria-describedby="password-help">
            <small id="password-help" class="form-help">Enter your password.</small>
          </div>
          <button type="submit" aria-describedby="login-help">Login</button>
          <small id="login-help" class="form-help">Click to log in to your account.</small>
        </form>
        <p>Don't have an account? <a href="#/register">Register here</a></p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('login-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Form validation
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
      const email = formData.get('email');
      const password = formData.get('password');

      if (!email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';

      try {
        const result = await loginUser({ email, password });
        if (result.error === false) {
          alert('Login successful!');
          window.location.hash = '#/';
        } else {
          alert('Login failed: ' + result.message);
        }
      } catch (error) {
        alert('Error during login. Please check your connection and try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    });
  }
}
