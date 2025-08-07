import { Play, Pause } from "./Player";
import { usePlayerStore } from "../store/playerStore.js";

export default function CardPlayButton({ id }) {
  const { isPlaying, setIsPlaying , currentSong, setCurrentSong } = usePlayerStore(state => state);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <button className="card-play-button rounded-full bg-green-500 p-4" onClick={handlePlayPause}>
      {isPlaying ? <Pause /> : <Play />}
    </button>
  );
}