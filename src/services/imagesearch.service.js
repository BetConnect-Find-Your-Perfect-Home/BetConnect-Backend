// Simple image search helper using Unsplash API
// Requires: UNSPLASH_ACCESS_KEY environment variable

export const searchImages = async (query, perPage = 10) => {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) throw new Error('UNSPLASH_ACCESS_KEY is not set');

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Image search API error: ${res.status} ${res.statusText} - ${text}`);
  }

  const data = await res.json();
  return (data.results || []).map((r) => ({ id: r.id, thumb: r.urls.small, full: r.urls.full, alt: r.alt_description }));
};

export default { searchImages };
