import { Play, Pause } from "./Player";
import { usePlayerStore } from "@/store/playerStore";

export default function CardPlayButton({ id }) {
  const {
    isPlaying,
    setIsPlaying,
    currentMusic,
    setCurrentMusic
  } = usePlayerStore(state => state);

  const handlePlayPause = () => {
    setCurrentMusic({
      playlist: {
        id
      }
    });

    setIsPlaying(!isPlaying);
  };

  const isPlayingPlaylist = isPlaying && currentMusic?.playlist.id === id;

  return (
    <button className="card-play-button rounded-full bg-green-500 p-4" onClick={handlePlayPause}>
      {isPlayingPlaylist ? <Pause /> : <Play />}
    </button>
  );
}