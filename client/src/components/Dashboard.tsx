import { useState, useEffect } from 'react'
import useAuth from './../hooks/useAuth';
import { IonPage, IonSearchbar, IonContent, IonFooter, IonHeader } from '@ionic/react';
import SpotifyWebApi from 'spotify-web-api-node';
import { TrackSearchResult } from './TrackSearchResult';
import { Player } from './Player';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi({
});

interface DashboardProps {
  code: string
}

interface SpotifySearchData {
  artist   : string;
  title    : string;
  uri      : string;
  albumUrl : string;
}

const Dashboard: React.FC<DashboardProps> = ({ code }: DashboardProps) => {
  const accessToken = useAuth(code);

  const [searchText, setSearchText] = useState('');
  const [lyrics, setLyrics] = useState('');
  
  const [searchResults, setSearchResults] = useState<SpotifySearchData[] | null>(null);
  const [playingTrack, setPlayingTrack] = useState<SpotifySearchData>();

  const chooseTrack = (track: SpotifySearchData): void => {
    setPlayingTrack(track);
    setSearchText('');
    setLyrics('');
  }

  // Use effect for the playing track.
  useEffect((): void => {
    if(!playingTrack) {
      return;
    }

    // Gets the lyrics from the backend and then sets the lyrics
    // once the promise resolves.
    axios.get('http://localhost:8101/lyrics', {
      params: {
        track: playingTrack.title,
        artist: playingTrack.artist
      }
    })
    .then(res => {
      setLyrics(res.data.lyrics);
    });
  }, [playingTrack]);

  // Use effect for the access token.
  useEffect(() => {
    if(!accessToken) {
      return;
    }

    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  // Use effect for the search text and access token.
  useEffect(() => {
    if(!searchText) {
      return setSearchResults([]);
    }

    if(!accessToken) {
      return;
    }

    let cancelRequest = false;
    spotifyApi.searchTracks(searchText)
    .then(res => {
      if(cancelRequest) {
        return;
      }

      const searchResults = res.body?.tracks?.items.map((track: SpotifyApi.TrackObjectFull): SpotifySearchData => {
        const smallestAlbumImage = track.album.images.reduce((smallest: SpotifyApi.ImageObject, image: SpotifyApi.ImageObject): SpotifyApi.ImageObject => {
          if(image.height && smallest.height && image.height < smallest.height) {
            return image;
          }

          return smallest;
        }, track.album.images[0]);

        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url
        }
      });

      if(searchResults) {
        setSearchResults(searchResults);
      }
    });

    return () => {
      cancelRequest = true;
    }
  }, [searchText, accessToken]);
  
  return (
    <IonPage>
      <IonHeader>
        <IonSearchbar
          value={searchText}
          onIonChange={event => {
            setSearchText(event.detail.value!);
          }}
          placeholder='Search Songs/Artists'
          showCancelButton='always'
        >
        </IonSearchbar>
      </IonHeader>
      <IonContent>
        {searchResults?.map((track) => (
          <TrackSearchResult 
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults?.length === 0 && (
          <div className='text-center' style={{ whiteSpace: 'pre' }}>
            {lyrics}
          </div>
        )}
      </IonContent>
      <IonFooter>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri}/>
      </IonFooter>
    </IonPage>
  )
}

export default Dashboard;
