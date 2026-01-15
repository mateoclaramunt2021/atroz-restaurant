// ====================================
// GESTOR DE COOKIES - ATROZ Restaurante
// ====================================

class CookieManager {
  constructor() {
    this.cookieName = 'cookie_consent_v1';
    this.defaultConsent = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    this.init();
  }

  init() {
    // Verificar si el usuario ya ha dado su consentimiento
    const consent = this.getConsent();
    
    if (!consent) {
      // Mostrar banner si no hay consentimiento previo
      this.showBanner();
    } else {
      // Cargar scripts según consentimiento previo
      this.loadScripts(consent);
    }

    // Agregar event listener para "Configurar Cookies"
    document.addEventListener('DOMContentLoaded', () => {
      const settingsButtons = document.querySelectorAll('#cookieSettings, #cookieSettingsFooter');
      settingsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showModal();
        });
      });
    });
  }

  getConsent() {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(this.cookieName + '='));
    
    if (!cookie) return null;
    
    try {
      return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    } catch (e) {
      return null;
    }
  }

  setConsent(consent) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    
    document.cookie = `${this.cookieName}=${encodeURIComponent(JSON.stringify(consent))}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
    
    this.loadScripts(consent);
    this.hideBanner();
  }

  showBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-top: 2px solid #8b1a1a;
        padding: 1.5rem 2rem;
        box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        max-width: 100%;
      ">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <p style="margin: 0 0 0.5rem 0; font-weight: bold; color: #333;">
              🍪 Usamos cookies para mejorar tu experiencia
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              Utilizamos cookies técnicas (necesarias), analíticas y de marketing. Solo usaremos analíticas y marketing con tu consentimiento.
              <a href="politica-cookies.html" style="color: #dc2626; text-decoration: none; font-weight: bold;">Más información</a>
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button id="cookie-reject" style="
              padding: 0.75rem 1.5rem;
              background: #f0f0f0;
              border: 1px solid #ddd;
              color: #333;
              cursor: pointer;
              border-radius: 4px;
              font-weight: bold;
              transition: background 0.3s;
            ">Rechazar</button>
            <button id="cookie-settings" style="
              padding: 0.75rem 1.5rem;
              background: #ffd700;
              border: none;
              color: #333;
              cursor: pointer;
              border-radius: 4px;
              font-weight: bold;
              transition: background 0.3s;
            ">Configurar</button>
            <button id="cookie-accept" style="
              padding: 0.75rem 1.5rem;
              background: #8b1a1a;
              border: none;
              color: white;
              cursor: pointer;
              border-radius: 4px;
              font-weight: bold;
              transition: background 0.3s;
            ">Aceptar todo</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Event listeners
    document.getElementById('cookie-accept').addEventListener('click', () => {
      this.setConsent({
        necessary: true,
        analytics: true,
        marketing: true
      });
    });

    document.getElementById('cookie-reject').addEventListener('click', () => {
      this.setConsent({
        necessary: true,
        analytics: false,
        marketing: false
      });
    });

    document.getElementById('cookie-settings').addEventListener('click', () => {
      this.showModal();
    });
  }

  showModal() {
    const consent = this.getConsent() || this.defaultConsent;
    
    const modal = document.createElement('div');
    modal.id = 'cookie-modal';
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      ">
        <div style="
          background: white;
          border-radius: 8px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="margin: 0; color: #8b1a1a; font-size: 1.5rem;">Preferencias de Cookies</h2>
            <button id="close-modal" style="
              background: none;
              border: none;
              font-size: 1.5rem;
              cursor: pointer;
              color: #999;
            ">✕</button>
          </div>

          <div style="margin-bottom: 2rem;">
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <input type="checkbox" id="cookie-necessary" checked disabled style="cursor: not-allowed;">
                <label for="cookie-necessary" style="margin: 0; cursor: default;">
                  <strong>Cookies Necesarias</strong>
                </label>
              </div>
              <p style="margin: 0.5rem 0 0 2rem; font-size: 0.9rem; color: #666;">
                Requeridas para el funcionamiento básico del sitio. No se pueden desactivar.
              </p>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <input type="checkbox" id="cookie-analytics" ${consent.analytics ? 'checked' : ''}>
                <label for="cookie-analytics" style="margin: 0; cursor: pointer;">
                  <strong>Cookies Analíticas</strong>
                </label>
              </div>
              <p style="margin: 0.5rem 0 0 2rem; font-size: 0.9rem; color: #666;">
                Nos ayudan a entender cómo usas el sitio. Completamente anónimas. Ejemplos: Google Analytics.
              </p>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <input type="checkbox" id="cookie-marketing" ${consent.marketing ? 'checked' : ''}>
                <label for="cookie-marketing" style="margin: 0; cursor: pointer;">
                  <strong>Cookies de Marketing</strong>
                </label>
              </div>
              <p style="margin: 0.5rem 0 0 2rem; font-size: 0.9rem; color: #666;">
                Nos permiten mostrar publicidad relevante. Ejemplos: Meta Pixel, Google Ads.
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button id="modal-reject" style="
              padding: 0.75rem 1.5rem;
              background: #f0f0f0;
              border: 1px solid #ddd;
              color: #333;
              cursor: pointer;
              border-radius: 4px;
              font-weight: bold;
            ">Solo necesarias</button>
            <button id="modal-save" style="
              padding: 0.75rem 1.5rem;
              background: #8b1a1a;
              border: none;
              color: white;
              cursor: pointer;
              border-radius: 4px;
              font-weight: bold;
            ">Guardar preferencias</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners del modal
    document.getElementById('close-modal').addEventListener('click', () => modal.remove());
    
    document.getElementById('modal-reject').addEventListener('click', () => {
      this.setConsent({
        necessary: true,
        analytics: false,
        marketing: false
      });
      modal.remove();
    });

    document.getElementById('modal-save').addEventListener('click', () => {
      const newConsent = {
        necessary: true,
        analytics: document.getElementById('cookie-analytics').checked,
        marketing: document.getElementById('cookie-marketing').checked
      };
      this.setConsent(newConsent);
      modal.remove();
    });

    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.transition = 'opacity 0.3s';
      banner.style.opacity = '0';
      setTimeout(() => banner.remove(), 300);
    }
  }

  loadScripts(consent) {
    // Cargar Google Analytics si se aceptan cookies analíticas
    if (consent.analytics) {
      this.loadGoogleAnalytics();
    }

    // Cargar Meta Pixel si se aceptan cookies de marketing
    if (consent.marketing) {
      this.loadMetaPixel();
    }
  }

  loadGoogleAnalytics() {
    // TODO: Reemplazar con tu Google Analytics ID
    const gaId = '[GOOGLE_ANALYTICS_ID]';
    if (gaId === '[GOOGLE_ANALYTICS_ID]') {
      console.log('Google Analytics ID no configurado. Reemplaza [GOOGLE_ANALYTICS_ID] en cookies.js');
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId);
  }

  loadMetaPixel() {
    // TODO: Reemplazar con tu Meta Pixel ID
    const pixelId = '[META_PIXEL_ID]';
    if (pixelId === '[META_PIXEL_ID]') {
      console.log('Meta Pixel ID no configurado. Reemplaza [META_PIXEL_ID] en cookies.js');
      return;
    }

    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }
}

// Inicializar gestor de cookies cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CookieManager();
  });
} else {
  new CookieManager();
}
