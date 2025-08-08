import { Play, Pause } from "./Player";
import { usePlayerStore } from "@/store/playerStore";

export default function CardPlayButton({ id }) {
  const {
    isPlaying,
    setIsPlaying,
    currentMusic,
    setCurrentMusic
  } = usePlayerStore(state => state);
  const isPlayingPlaylist = isPlaying && currentMusic?.playlist.id === id;

  const handlePlayPause = () => {
  if (isPlayingPlaylist) {
      setIsPlaying(false);
      return;
  }
    fetch(`/api/get-info-playlist.json?id=${id}`)
      .then(res => res.json())
      .then(data => {
        const { songs, playlist } = data;
        setIsPlaying(true);
        setCurrentMusic({ playlist, songs, song: songs[0] });

        console.log("Current music set:", { playlist, songs, song: songs[0] });
      });
  };


  return (
    <button className="card-play-button rounded-full bg-green-500 p-4" onClick={handlePlayPause}>
      {isPlayingPlaylist ? <Pause /> : <Play />}
    </button>
  );
}