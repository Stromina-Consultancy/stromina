const GA_MEASUREMENT_ID = 'G-HTK1V5H78L';
const COOKIE_CONSENT_KEY = 'stromina_cookie_consent';

function loadGoogleTag() {
  if (window.__strominaGtagLoaded) {
    return;
  }

  window.__strominaGtagLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
}

function createCookieBanner() {
  if (document.getElementById('cookie-banner')) {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner__content">
      <div>
        <strong>Cookies</strong>
        <p>We gebruiken Google Analytics om de website te verbeteren. Kies of je dit toestaat.</p>
      </div>
      <div class="cookie-banner__actions">
        <button type="button" class="button button-light cookie-banner__decline">Alleen noodzakelijke</button>
        <button type="button" class="button button-blue cookie-banner__accept">Accepteren</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  banner.querySelector('.cookie-banner__accept').addEventListener('click', () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    loadGoogleTag();
    banner.remove();
  });

  banner.querySelector('.cookie-banner__decline').addEventListener('click', () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    banner.remove();
  });
}

const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
if (storedConsent === 'accepted') {
  loadGoogleTag();
} else if (storedConsent !== 'declined') {
  createCookieBanner();
}

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const button = contactForm.querySelector('button[type="submit"]');
    const buttonText = button.textContent;

    if (successMessage) {
      successMessage.style.display = 'none';
    }
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
    
    button.textContent = 'Verzenden...';
    button.disabled = true;
    
    const formData = new FormData(contactForm);
    
    fetch('send_email.php', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      const data = await response.json().catch(() => ({ success: false, message: 'Onverwachte serverrespons' }));
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Fout bij verzenden');
      }
      return data;
    })
    .then(data => {
      contactForm.reset();
      if (successMessage) {
        successMessage.style.display = 'block';
      }
      button.textContent = buttonText;
      button.disabled = false;
      
      setTimeout(() => {
        if (successMessage) {
          successMessage.style.display = 'none';
        }
      }, 5000);
    })
    .catch(error => {
      console.error('Error:', error);
      if (errorMessage) {
        errorMessage.style.display = 'block';
      }
      button.textContent = buttonText;
      button.disabled = false;
    });
  });
}

// Update year in footer
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
