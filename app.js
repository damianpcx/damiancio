async function addItem() {
  const urlInput = document.getElementById('urlInput');
  const url = urlInput.value.trim();
  if (!url) return;

  try {
    const response = await fetch(`https://wishlist-scrapper.onrender.com/scrape?url=${encodeURIComponent(url)}`);
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
