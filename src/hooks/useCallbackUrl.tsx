import React from "react";

const useCallbackUrl = () => {
  const [url, setUrl] = React.useState<string>();
  React.useEffect(() => {
    const url = new URL(location.href);
    setUrl(url.searchParams.get("callbackUrl") as string);
  }, []);
  return url;
};

export default useCallbackUrl;
