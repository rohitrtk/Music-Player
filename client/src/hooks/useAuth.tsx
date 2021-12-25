import { useState, useEffect } from 'react'
import axios from 'axios';

/**
 * Use authentication hook.
 * 
 * @param {string | null} code 
 * @returns {string} The access token based on the given code
 */
const useAuth = (code: string | null): string => {
  const [accessToken, setAccessToken]   = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn]       = useState(0);

  // Use effect hook for code state
  useEffect((): void => {
    axios.post('http://localhost:8101/login', {
      code
    })
    .then(res => {
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setExpiresIn(res.data.expiresIn);
      window.history.pushState({}, '', '/');
    })
    .catch((error) => {
      console.log(error);
      window.location.href = '/';
    });
  }, [code]);

  // Use effect for the refresh token and expires in state
  useEffect((): VoidFunction => {
    if(!refreshToken || !expiresIn) {
      return () => {};
    }
    
    const interval = setInterval((): void => {
      axios.post('http://localhost:8101/refresh', {
        refreshToken
      })
      .then(res => {
        setAccessToken(res.data.accessToken);
        setExpiresIn(res.data.expiresIn);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = '/';
      });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);

  }, [refreshToken, expiresIn]);

  return accessToken;
}

export default useAuth;