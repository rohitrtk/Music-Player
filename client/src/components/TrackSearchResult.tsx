import React from 'react';


export const TrackSearchResult = ( {track, chooseTrack}: any ) => {
  
  const artist = track.artist;
  const uri = track.uri;
  const title = track.title;
  const albumUrl = track.albumUrl;

  const handlePlay = () => {
    chooseTrack(track);
  }

  return (
    <div
      className='d-flex m-2 align-items-center'
      style={{cursor: 'pointer'}}
      onClick={handlePlay}
    >
      <img src={albumUrl} style={{height: '64px', width: '64px'}} alt=''/>
      <div className='ml-6'>
        <div>{title}</div>
        <div className='text-muted'>{artist}</div>
      </div>
    </div>
  )
}
