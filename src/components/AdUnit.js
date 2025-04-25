import { useEffect, useRef } from 'react';

export default function AdUnit({ slot, format = 'auto', responsive = true }) {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && window.adsbygoogle) {
      adRef.current.innerHTML = '';
      ;(window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, [slot]);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}                     // ← JS object
      data-ad-client="ca-pub-1417536970473743"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
      ref={adRef}
    />                                                // ← self-closed
  );
}
