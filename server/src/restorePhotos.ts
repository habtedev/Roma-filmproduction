import { INITIAL_SITE_CONTENT } from './db/initialData';

async function restore() {
  const res = await fetch('http://localhost:4000/api/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photos: INITIAL_SITE_CONTENT.photos })
  });
  console.log(await res.text());
}

restore();
