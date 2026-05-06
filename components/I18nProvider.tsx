"use client";

import { useEffect, useState } from "react";

export default function I18nProvider({ 
  children, 
  locale 
}: { 
  children: React.ReactNode;
  locale: string;
}) {
  const [messages, setMessages] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    async function loadMessages() {
      const msgs = await import(`../messages/${locale}.json`);
      setMessages(msgs.default);
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <>{children}</>;
  }

  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}
