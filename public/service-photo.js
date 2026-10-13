/* YRUZPHOTO - met la photo "Yvan Ruz" de Payload dans la carte du service PHOTO. */
(async () => {
  const images = [...document.querySelectorAll('img[data-payload-service-photo]')];
  if (!images.length) return;
  try {
    const response = await fetch('/api/media?limit=50&sort=-createdAt&depth=0', {
      credentials: 'same-origin', cache: 'no-store'
    });
    if (!response.ok) return;
    const { docs = [] } = await response.json();
    const photo = docs.find((doc) => String(doc.alt || '').trim().toLowerCase() === 'yvan ruz');
    if (!photo) return;
    const url = photo.url || photo.sizes?.cover?.url;
    if (!url || typeof url !== 'string' || !/^\/|^https:\/\//.test(url)) return;
    for (const image of images) {
      image.src = url;
      image.alt = photo.alt || 'Photographie YRUZPHOTO';
    }
  } catch (error) {
    console.warn('Photo service indisponible, visuel de secours conserve.', error);
  }
})();
