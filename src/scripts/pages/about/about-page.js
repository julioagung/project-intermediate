export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 2rem; color: var(--text-primary); text-align: center;">About Dicoding Stories</h1>

          <div style="background: var(--bg-primary); padding: 2rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md); margin-bottom: 2rem;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 1rem; color: var(--text-primary);">Our Mission</h2>
            <p style="font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 1.5rem;">
              Dicoding Stories is a modern web application that empowers users to share their personal stories with the world, enhanced by location data. We believe that every story has a place, and every place has a story.
            </p>
            <p style="font-size: 1.1rem; line-height: 1.7; color: var(--text-secondary);">
              Our platform combines the art of storytelling with the power of interactive maps, allowing users to create rich, location-aware narratives that connect people across geographical boundaries.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
            <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
              <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-primary);">\ud83d\udccd Location-Aware Stories</h3>
              <p style="color: var(--text-secondary); line-height: 1.6;">
                Share your experiences with precise location data, allowing others to explore stories from around the world.
              </p>
            </div>

            <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
              <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-primary);">\ud83d\udcf8 Rich Media Support</h3>
              <p style="color: var(--text-secondary); line-height: 1.6;">
                Upload photos and capture moments with our built-in camera functionality for authentic storytelling.
              </p>
            </div>

            <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
              <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-primary);">\ud83d\uddfa\ufe0f Interactive Maps</h3>
              <p style="color: var(--text-secondary); line-height: 1.6;">
                Explore stories on beautiful, interactive maps with multiple viewing options including satellite imagery.
              </p>
            </div>

            <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
              <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: var(--text-primary);">\ud83d\udcf1 Responsive Design</h3>
              <p style="color: var(--text-secondary); line-height: 1.6;">
                Enjoy a seamless experience across all devices with our fully responsive, mobile-first design.
              </p>
            </div>
          </div>

          <div style="background: var(--bg-primary); padding: 2rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-md);">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 1rem; color: var(--text-primary);">Technology Stack</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">\u26a1\ufe0f</div>
              <strong>Vanilla JavaScript</strong>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Modern ES6+ JavaScript</p>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">\ud83d\uddfa\ufe0f</div>
              <strong>Leaflet Maps</strong>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Interactive mapping library</p>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">\ud83c\udfa8</div>
              <strong>CSS Variables</strong>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Modern styling approach</p>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">\ud83d\udcf1</div>
              <strong>Responsive Design</strong>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Mobile-first approach</p>
            </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Add smooth scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all feature cards and sections
    document.querySelectorAll('.container > div > div').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
}
