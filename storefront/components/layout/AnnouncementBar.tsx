"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface CampaignAnnouncement {
  id: string;
  name: string;
  description?: string;
}

interface AnnouncementBarProps {
  campaigns: CampaignAnnouncement[];
}

export default function AnnouncementBar({
  campaigns,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem("announcement-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < oneDay) {
        setIsVisible(false);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("announcement-dismissed", Date.now().toString());
  };

  const messages = campaigns.map((c) => c.name);

  if (!isVisible || messages.length === 0) return null;

  return (
    <div className="bg-primary-600 text-white relative">
      {/* Inject keyframes for marquee */}
      <style>{`
        @keyframes announcement-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-2">
        {messages.length === 1 ? (
          <div className="flex items-center justify-center gap-4 text-sm">
            <p className="text-center font-medium">{messages[0]}</p>
            <button
              onClick={handleDismiss}
              className="ml-2 hover:bg-white/20 rounded p-0.5 transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div
              className="flex"
              style={mounted ? {
                animation: "announcement-marquee 15s linear infinite",
                width: "max-content",
              } : {
                width: "max-content",
              }}
            >
              {/* First set */}
              {messages.map((msg, i) => (
                <span key={i} className="whitespace-nowrap text-sm font-medium px-8">{msg}</span>
              ))}
              {/* Duplicate set for seamless loop */}
              {messages.map((msg, i) => (
                <span key={`dup-${i}`} className="whitespace-nowrap text-sm font-medium px-8">{msg}</span>
              ))}
            </div>
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-primary-600 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-primary-600 to-transparent pointer-events-none" />
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded p-0.5 transition-colors z-10"
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
