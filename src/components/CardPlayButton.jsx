import { Play, Pause } from "./Player";
import { usePlayerStore } from "@/store/playerStore";

export default function CardPlayButton({ id }) {
  const {
    isPlaying,
    setIsPlaying,
    currentMusic,
    setCurrentMusic
  } = usePlayerStore(state => state);
  const isPlayingPlaylist = isPlaying && currentMusic?.playlist?.id === id
  const isThisPlaylistInStore = currentMusic?.playlist?.id === id

  const handlePlayPause = () => {
    if (isPlayingPlaylist) {
      setIsPlaying(false);
      return;
    }
    fetch(`/api/get-info-playlist.json?id=${id}`)
      .then(res => res.json())
      .then(data => {
        // Asegúrate de que tienes datos en 'data' para evitar errores
        if (data.playlist && data.songs && data.songs.length > 0) {
          const { songs, playlist } = data;
          setIsPlaying(true); // Ponemos el estado en reproducción
          setCurrentMusic({ playlist, song: songs[0], songs }); // Establecemos la playlist y la canción actual
          console.log('Playlist data set:', { playlist, song: songs[0], songs });
        } else {
          console.error("No songs found in the playlist");
        }
      })
      .catch(error => {
        console.error("Error fetching playlist data:", error);
      });
  };


  return (
    <button className="card-play-button rounded-full bg-green-500 p-4" onClick={handlePlayPause}>
      {isPlayingPlaylist ? <Pause /> : <Play />}
    </button>
  );
}