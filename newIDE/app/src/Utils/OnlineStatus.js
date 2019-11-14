// @flow
import * as React from 'react';

function getOnlineStatus() {
  return typeof navigator !== 'undefined' &&
    typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
}

/**
 * React Hook listening to the navigator online status.
 */
export const useOnlineStatus = () => {
  const [onlineStatus, setOnlineStatus] = React.useState(getOnlineStatus());

  const goOnline = () => setOnlineStatus(true);

  const goOffline = () => setOnlineStatus(false);

  React.useEffect(() => {
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return onlineStatus;
};

type Props = {|
  children: (onlineStatus: boolean) => React.Node,
|};

/**
 * Component listening to the navigator online status, passing
 * it down to children.
 */
export const OnlineStatus = ({ children }: Props) => {
  const onlineStatus = useOnlineStatus();
  return children(onlineStatus);
};
