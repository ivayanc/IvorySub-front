import React, { createContext, useContext, useEffect, useState } from 'react';
import Gun from 'gun';

const GunContext = createContext(null);

export const GunProvider = ({ peers, children }) => {
  const [gun, setGun] = useState(null);

  useEffect(() => {
    const gunInstance = Gun({
      peers: peers // Array of peer URLs
    });

    setGun(gunInstance);

    return () => {
      // Cleanup if needed
      gunInstance && gunInstance.off();
    };
  }, [peers]);

  return (
    <GunContext.Provider value={gun}>
      {children}
    </GunContext.Provider>
  );
};

export const useGun = () => useContext(GunContext);
