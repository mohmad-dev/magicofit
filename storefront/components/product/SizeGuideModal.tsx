"use client";

import { useState, useEffect, useRef } from "react";
import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const clothingSizes = [
  { label: "S", chest: "86-91", waist: "71-76", hips: "86-91" },
  { label: "M", chest: "91-96", waist: "76-81", hips: "91-96" },
  { label: "L", chest: "96-101", waist: "81-86", hips: "96-101" },
  { label: "XL", chest: "101-106", waist: "86-91", hips: "101-106" },
  { label: "XXL", chest: "106-111", waist: "91-96", hips: "106-111" },
];

const shoeSizes = [
  { eu: "38", us: "6", uk: "5.5", cm: "24" },
  { eu: "39", us: "7", uk: "6", cm: "24.5" },
  { eu: "40", us: "7.5", uk: "6.5", cm: "25" },
  { eu: "41", us: "8", uk: "7", cm: "25.5" },
  { eu: "42", us: "8.5", uk: "7.5", cm: "26" },
  { eu: "43", us: "9.5", uk: "8.5", cm: "27" },
  { eu: "44", us: "10", uk: "9", cm: "27.5" },
  { eu: "45", us: "11", uk: "10", cm: "28" },
  { eu: "46", us: "12", uk: "11", cm: "29" },
];

type TabType = "clothing" | "shoes" | "howToMeasure";

export default function SizeGuideModal({ isOpen, onClose, category = "clothing" }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>(
    category === "shoes" ? "shoes" : "clothing"
  );
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <Ruler className="h-6 w-6 text-primary-600" />
            <h2 className="font-outfit text-xl font-extrabold text-neutral-900 uppercase">
              Size Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Close size guide"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 px-6">
          {[
            { id: "clothing" as TabType, label: "Clothing" },
            { id: "shoes" as TabType, label: "Shoes" },
            { id: "howToMeasure" as TabType, label: "How to Measure" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "clothing" && (
            <div>
              <p className="text-sm text-neutral-600 mb-4">
                All measurements are in centimeters (cm)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 font-bold text-neutral-900">Size</th>
                      <th className="text-left py-3 px-4 font-bold text-neutral-900">Chest</th>
                      <th className="text-left py-3 px-4 font-bold text-neutral-900">Waist</th>
                      <th className="text-left py-3 px-4 font-bold text-neutral-900">Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clothingSizes.map((size) => (
                      <tr key={size.label} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4 font-bold text-neutral-900">{size.label}</td>
                        <td className="py-3 px-4 text-neutral-700">{size.chest} cm</td>
                        <td className="py-3 px-4 text-neutral-700">{size.waist} cm</td>
                        <td className="py-3 px-4 text-neutral-700">{size.hips} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "shoes" && (
            <div>
              <p className="text-sm text-neutral-600 mb-4">
                Shoe size conversion chart
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 font-bold text-neutral-900">EU</th>
                      <th className="text-left py-3 px-4 font-bold text-neutral-900">US</th>
                      <th className="text-left py-3 px-4 font-bold text-neutral-900">UK</th>
                      <th className="text-left py-3 px-4 font-bold text-neutral-900">CM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoeSizes.map((size) => (
                      <tr key={size.eu} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4 font-bold text-neutral-900">{size.eu}</td>
                        <td className="py-3 px-4 text-neutral-700">{size.us}</td>
                        <td className="py-3 px-4 text-neutral-700">{size.uk}</td>
                        <td className="py-3 px-4 text-neutral-700">{size.cm} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "howToMeasure" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-neutral-900 mb-2">Chest</h3>
                <p className="text-neutral-600 text-sm">
                  Measure around the fullest part of your chest, keeping the tape horizontal.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 mb-2">Waist</h3>
                <p className="text-neutral-600 text-sm">
                  Measure around the narrowest part of your waist, keeping the tape horizontal.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 mb-2">Hips</h3>
                <p className="text-neutral-600 text-sm">
                  Measure around the fullest part of your hips, keeping the tape horizontal.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 mb-2">Foot Length</h3>
                <p className="text-neutral-600 text-sm">
                  Stand on a piece of paper and mark the tip of your longest toe and the back of your heel. Measure the distance between the two marks.
                </p>
              </div>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-primary-800 font-medium">
                  Tip: If you&apos;re between sizes, we recommend going up to the next size for a more comfortable fit.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
