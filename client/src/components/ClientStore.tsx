import { createContext, useState } from 'react';

const initialState = {
  clientId: '',
  redirectUrl: '',
  scopes: []
}

const context = createContext<typeof initialState>(initialState);

const ClientStore = () => {
  //const 

  /* return (
    <context.Provider value={}>

    </context.Provider>
  ); */
}