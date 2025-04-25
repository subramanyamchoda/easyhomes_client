// src/components/AdUnit.js
import React, { useEffect, useRef } from 'react';

export default function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  client = 'ca-pub-1417536970473743'
}) {
  const adRef = useRef();

  useEffect(() => {
    // clear any old ad markup
    if (adRef.current) adRef.current.innerHTML = '';
    // trigger a new ad request
    ;(window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [slot]);

  return (
    <ins
      className="adsbygoogle"
      ref={adRef}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  );
}
