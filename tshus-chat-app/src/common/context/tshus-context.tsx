import React from 'react';
import io from 'socket.io-client';
import { ThemeEnum } from '../enum/theme.enum';

export const TshusContext = React.createContext(null);

interface Props {
  children: React.ReactNode;
}

const TshusProvider: React.FC<Props> = ({ children }: Props) => {
  // Config
  const [config, setConfig] = React.useState(() => {
    // Default Config
    const defaultConfig = { theme: ThemeEnum.LIGHT };

    // Get config
    const data: any = localStorage.getItem('config');

    // Check and set config to local storage
    !data && localStorage.setItem('config', JSON.stringify(defaultConfig));

    // Return
    return data ? JSON.parse(data) : defaultConfig;
  });

  // Stomp client state
  const [socket, setSocket] = React.useState(null);

  // Handle set config
  const handleSetConfig: Function = (key: string, value: any) => {
    // New Config
    const newConfig: object = { ...config, [key]: value };

    // Set config
    setConfig(newConfig);

    // Set config to local storage
    localStorage.setItem('config', JSON.stringify(newConfig));
  };

  // Use Effect
  React.useEffect(() => {
    // Calling connecting
    const socket: any = io(`http://localhost:2820`);

    // Set Client
    setSocket(socket);

    // Return clean
    return () => {
      // Disconnect Socket
      socket.disconnect();

      // Clean
      setSocket(null);
    };
  }, []);

  // Shared Data
  const sharedData: any = {
    config: {
      get: config,
      set: handleSetConfig,
    },
    socket: { get: socket },
  };

  // Return
  return (
    <TshusContext.Provider value={sharedData}>{children}</TshusContext.Provider>
  );
};

export default TshusProvider;
