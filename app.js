document.addEventListener('DOMContentLoaded', renderWishlist);

async function addItem() {
  const urlInput = document.getElementById('urlInput');
  const url = urlInput.value.trim();
  if (!url) return;

  const proxy = 'https://api.allorigins.win/get?url=';
  const response = await fetch(proxy + encodeURIComponent(url));
  const data = await response.json();

  const html = data.contents;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const title = doc.querySelector('meta[property="og:title"]')?.content ||
                doc.title || 'No title';

  const image = doc.querySelector('meta[property="og:image"]')?.content || '';

  const price = doc.querySelector('meta[property="product:price:amount"]')?.content ||
                'Unknown';

  const item = { title, image, price, url };

  saveItem(item);
  renderWishlist();

  urlInput.value = '';
}

function saveItem(item) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  wishlist.push(item);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function renderWishlist() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const wishlistDiv = document.getElementById('wishlist');
  wishlistDiv.innerHTML = '';

  wishlist.forEach(item => {
    const itemHTML = `
      <div class="item">
        ${item.image ? `<img src="${item.image}" alt="${item.title}"/>` : ''}
        <div>
          <h3>${item.title}</h3>
          <p>Price: ${item.price}</p>
          <a href="${item.url}" target="_blank">View Product</a>
        </div>
      </div>
    `;
    wishlistDiv.innerHTML += itemHTML;
  });
  if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered.', reg))
      .catch(err => console.log('Service Worker registration failed.', err));
  });
}

}
