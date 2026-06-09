'use client';

import { useEffect, useState } from 'react';

const quotientLeadFormSrc = 'https://www.quotientapp.com/e/17251-dc26ea1bb5ec4fe6b9bb86531d1d0cdb/form?embed';
const quotientOrigin = 'https://www.quotientapp.com';
const defaultIframeHeight = 600;

export function QuotientLeadForm() {
  const [iframeHeight, setIframeHeight] = useState(defaultIframeHeight);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== quotientOrigin || !event.data || typeof event.data !== 'object') {
        return;
      }

      const nextHeight = Number((event.data as { changeHeight?: unknown }).changeHeight);

      if (Number.isFinite(nextHeight)) {
        setIframeHeight(Math.max(defaultIframeHeight, Math.min(nextHeight, 1800)));
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="surface-panel overflow-hidden rounded-lg p-0" data-testid="quotient-lead-form">
      <iframe
        className="block w-full border-0"
        data-testid="quotient-lead-form-iframe"
        height={iframeHeight}
        marginHeight={0}
        marginWidth={0}
        src={quotientLeadFormSrc}
        title="Quotient lead form"
      />
    </div>
  );
}
