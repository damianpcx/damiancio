document.addEventListener('DOMContentLoaded', renderWishlist);

async function addItem() {
  const urlInput = document.getElementById('urlInput');
  const url = urlInput.value.trim();
  if (!url) return;

  const proxies = [
    'https://api.allorigins.win/get?url=',
    'https://cors-anywhere.herokuapp.com/',
  ];

  let data = null;
  let success = false;

  for (const proxy of proxies) {
    try {
      const fetchUrl = proxy + encodeURIComponent(url);
      const response = await fetch(fetchUrl, {
        headers: proxy.includes('cors-anywhere') ? { Origin: location.origin } : {}
      });
      if (!response.ok) throw new Error('Network response not ok');

      if (proxy.includes('allorigins')) {
        const json = await response.json();
        data = json.contents;
      } else {
        data = await response.text();
      }

      success = true;
      break;
    } catch (err) {
      console.warn(`Fetch failed using proxy ${proxy}: ${err.message}`);
    }
  }

  if (!success) {
    alert('Sorry, failed to fetch product info. Please try again later.');
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');

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
}
