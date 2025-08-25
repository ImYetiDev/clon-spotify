import { usePlayerStore } from '@/store/playerStore';
import { useState, useRef, useEffect } from 'react';
import Slider from './Slider';
import { VolumeSilenced, VolumeFull } from '@/icons/VolumeIcons';

export const Play = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" ><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"></path></svg>
);

export const Pause = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"></path></svg>
);

const CurrentSong = ({ image, title, artists }) => {
  return (
    <div
      className='
        flex items-center gap-5 relative overflow-hidden'>
      <picture className='w-16 h-16 bg-zinc-500 rounded-md shadow-lg overflow-hidden'>
        <img src={image} alt={title} />
      </picture>

      <div className='flex flex-col'>
        <h3 className='font-semibold block text-sm'>
          {title}
        </h3>
        <span className='text-xs opacity-80'>
          {artists?.join(', ')}
        </span>
      </div>
    </div>
  );
};

const SongControl = ({ audio }) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    audio.current.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      audio.current.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  const handleTimeUpdate = () => {
    setCurrentTime(audio.current.currentTime); // devuelve en seg 145s => 02:25
  }

  const formatTime = time => {
    if (time == null) return '00:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const duration = audio.current?.duration ?? 0;

  return (
    <div className='flex items-center gap-x-3 text-xs text-white w-full'>
      <span className='opacity-80 w-12 text-right'>{formatTime(currentTime)}</span>

      <Slider
        className='w-[400px]'
        min={0}
        max={audio.current?.duration ?? 0}
        value={[currentTime]}
        defaultValue={[0]}
        onValueChange={(value) => {
          audio.current.currentTime = value;
        }}
      />

      {duration ? <span className='opacity-80 w-12'>{formatTime(duration)}</span> : null}
    </div>
  );
}

const VolumeControl = () => {
  const volume = usePlayerStore(state => state.volume);
  const setVolume = usePlayerStore(state => state.setVolume);
  const previousVolumeRef = useRef(volume);

  const isVolumeMuted = volume < 0.1;
  const handleClickVolumen = () => {
    if (isVolumeMuted) {
      setVolume(previousVolumeRef.current)
    } else {
      previousVolumeRef.current = volume;
      setVolume(0)
    }

  }

  return (
    <div className="flex justify-center gap-x-2 text-white">
      <button className='opacity-70 hover:opacity-100 transition' onClick={handleClickVolumen}>
        {isVolumeMuted < 0.1 ? <VolumeFull /> : <VolumeSilenced />}
      </button>

      <Slider
        min={0}
        max={100}
        value={volume * 100}
        defaultValue={100}
        onValueChange={(value) => {
          const [newVolume] = value;
          const volumeValue = newVolume / 100;
          setVolume(volumeValue);
        }}
      />
    </div>
  );
};

export default function Player() {
  const { currentMusic, isPlaying, setIsPlaying, volume } = usePlayerStore(state => state);
  const audioRef = useRef();
  const volumeRef = useRef(1);

  useEffect(() => {
    isPlaying
      ? audioRef.current.play()
      : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const { songs, song, playlist } = currentMusic;

    if (song && playlist) {
      const src = `/music/${playlist?.id}/0${song.id}.mp3`;
      console.log('Current song source:', src);
      audioRef.current.src = src;
      audioRef.current.volume = volume;
      audioRef.current.play();
    } else {
    }
  }, [currentMusic]);


  const handleClick = () => {
    setIsPlaying(!isPlaying);

  };

  return (
    <div className="flex flex-row justify-between w-full px-1 z-50">
      <div className='w-[200px]'>
        <CurrentSong {...currentMusic?.song} />
      </div>

      <div className="grid place-content-center gap-4 flex-1">
        <div className="flex justify-center flex-col items-center">
          <button className="bg-white rounded-full p-2 hover:cursor-pointer" onClick={handleClick}>
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <SongControl audio={audioRef} />
        </div>
      </div>

      <div className='grid place-content-center'>
        <VolumeControl />
      </div>

      <audio ref={audioRef}></audio>
    </div>
  );
}