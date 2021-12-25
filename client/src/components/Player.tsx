import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

interface PlayerProps {
  accessToken: string;
  trackUri: string | undefined;
}

export const Player: React.FC<PlayerProps> = ({ accessToken, trackUri }: PlayerProps) => {
  const [play, setPlay] = useState(false);

  useEffect((): void => setPlay(true), [trackUri]);

  if(!accessToken) {
    return null;
  }

  return (
    <SpotifyPlayer 
      token={accessToken}
      showSaveIcon
      uris={trackUri ?  [trackUri] : []}
      callback={state => {
        if(!state.isPlaying) {
          setPlay(false);
        }
      }}
      play={play}
      />
  );
}
