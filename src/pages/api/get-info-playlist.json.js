import { allPlaylists, songs as allSongs } from "@/lib/data";

export async function GET({ params, request }) {
  const { url } = request;
  const urlObject = new URL(url);
  const id = urlObject.searchParams.get("id");

  const playlist = allPlaylists.find((playlist) => playlist.id === id);

  if (!playlist) {
    return new Response(JSON.stringify({ error: 'Playlist not found' }), { status: 404 });
  }

  /* // Verificar que el `id` de la playlist y el `albumId` de las canciones coincidan
  console.log('Playlist:', playlist); // Verifica que la playlist tenga un `id` correcto
  console.log('All Songs:', allSongs); // Revisa todas las canciones disponibles */

  const songs = allSongs.filter(song => song.albumId === playlist.albumId);
  /* console.log('Filtered Songs:', songs); // Verifica las canciones que se están filtrando */

  return new Response(JSON.stringify({ playlist, songs }), {
    headers: { "Content-Type": "application/json" },
  });
}
