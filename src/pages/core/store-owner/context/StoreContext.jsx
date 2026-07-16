import React, { createContext, useContext, useState } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [storeData, setStoreData] = useState(null);

  return (
    <StoreContext.Provider value={{ storeData, setStoreData }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  return useContext(StoreContext);
}
