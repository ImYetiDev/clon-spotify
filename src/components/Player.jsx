import { usePlayerStore } from '@/store/playerStore';
import { useState, useRef, useEffect } from 'react';

export const Play = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" ><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"></path></svg>
);

export const Pause = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"></path></svg>
);


export default function Player() {
  const {  isPlaying, setIsPlaying } = usePlayerStore(state => state);
  const [CurrentSong, setCurrentSong] = useState(null);
  const audioRef = useRef();

  useEffect(() => {
    // Load the audio file when the component mounts
    audioRef.current.src = "/music/1/01.mp3";
  }, []);

  const handleClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
    }
    else {
      audioRef.current.play()
      audioRef.current.volume = 0.5; // Set initial volume
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-row justify-between w-full px-4 z-50">
      <div>
        CurrentSong
      </div>

      <div className="grid place-content-center gap-4 flex-1">
        <div className="flex justify-center">
          <button className="bg-white rounded-full p-2 hover:cursor-pointer" onClick={handleClick}>
            {isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      </div>

      <div>
        VolumeControl
      </div>

      <audio ref={audioRef}></audio>
    </div>
  );
}