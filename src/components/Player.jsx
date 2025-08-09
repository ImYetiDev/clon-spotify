import { usePlayerStore } from '@/store/playerStore';
import { useState, useRef, useEffect } from 'react';

export const Play = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" ><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"></path></svg>
);

export const Pause = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"></path></svg>
);

const CurrentSong = ({ image, title }) => {
  return (
    <div
      className='
        flex items-center gap-5 relative overflow-hidden'>
      <picture className='w-16 h-16 bg-zinc-500 rounded-md shadow-lg overflow-hidden'>
        <img src={image} alt={title} />
      </picture>

      <h3 className='font-bold block'>
        {title}
      </h3>
    </div>
  );
};

export default function Player() {
  const { currentMusic, isPlaying, setIsPlaying } = usePlayerStore(state => state);
  const audioRef = useRef();

  useEffect(() => {
    isPlaying
      ? audioRef.current.play()
      : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    const { songs, song, playlist } = currentMusic;

    if (song && playlist) {
      const src = `/music/${playlist?.id}/0${song.id}.mp3`;
      audioRef.current.src = src;
      audioRef.current.load();
    } else {
    }
  }, [currentMusic]);


  const handleClick = () => {
    setIsPlaying(!isPlaying);

  };

  return (
    <div className="flex flex-row justify-between w-full px-4 z-50">
      <div>
        <CurrentSong image={currentMusic?.song?.image} title={currentMusic?.song?.title} />
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