document.addEventListener('DOMContentLoaded', renderWishlist);

async function addItem() {
  const urlInput = document.getElementById('urlInput');
  const url = urlInput.value.trim();
  if (!url) return;

  try {
    const response = await fetch(`https://wishlist-scrapper.onrender.com`);
    const data = await response.json();

    const item = { title: data.title, image: data.image, price: data.price, url: data.url };

    saveItem(item);
    renderWishlist();
    urlInput.value = '';
  } catch (err) {
    console.error(err);
    alert('Failed to fetch product info. Please try again later.');
  }
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
