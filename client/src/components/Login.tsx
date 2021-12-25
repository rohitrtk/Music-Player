import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Container } from 'react-bootstrap';

const Login: React.FC = () => {
  const [authUrl, setAuthUrl] = useState('');

  // Gets the authorization url from the backend server
  useEffect((): void => {
    axios.get('http://localhost:8101/authurl').then((res) => {
      const clientId: string = res.data.clientId;
      const redirectUri: string = res.data.redirectUri;
      const scopes: string[] = [
        'streaming', 'user-read-email', 'user-read-private', 'user-library-read',
        'user-library-modify', 'user-read-playback-state', 'user-modify-playback-state'
      ];

      const _authUrl: string = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}`;
      setAuthUrl(_authUrl);
    });
  }, [authUrl]);

  return (
    <Container 
      className='d-flex justify-content-center align-items-center'
      style={{ minHeight: '100vh' }}
    >
      <a className='btn btn-success btn-lg' href={authUrl}>
        Login With Spotify
      </a>
    </Container>
  );
}

export default Login;