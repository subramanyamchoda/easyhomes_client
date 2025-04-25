  import { useEffect, useRef } from 'react';

export default function AdUnit({ slot, format = 'auto', responsive = true }) {
  const adRef = useRef(null);

  useEffect(() => {
    if (window.adsbygoogle && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error', e);
      }
    }
  }, [slot]);

  return (
<ins
  className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-1417536970473743"
  data-ad-slot={slot}
  data-ad-format={format}
  data-full-width-responsive={responsive ? 'true' : 'false'}
  ref={adRef}
/>
 // Use regular open/close tag for <ins> in JSX
  );
}
