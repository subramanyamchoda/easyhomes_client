import { useEffect, useRef } from 'react';

export default function AdUnit({ slot, format = 'auto', responsive = true }) {
  const adRef = useRef();

  useEffect(() => {
    adRef.current.innerHTML = '';                  // clear any old ad
    (adsbygoogle = window.adsbygoogle || []).push({});
  }, [slot]);

  return (
  <ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1417536970473743"
     data-ad-slot="7484094536"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
  );
}
