"use client";

import { useState, useEffect, useRef } from "react";
import { X, Ruler, User, Footprints, Shirt, RulerIcon } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-l from-primary-600 to-primary-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Ruler className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-outfit text-xl font-extrabold text-white uppercase tracking-wide">
              دليل المقاسات
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close size guide"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-neutral-50 border-b border-neutral-100">
          {[
            { id: "clothing" as TabType, label: "الملابس", icon: Shirt },
            { id: "shoes" as TabType, label: "الأحذية", icon: Footprints },
            { id: "howToMeasure" as TabType, label: "طريقة القياس", icon: RulerIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold transition-all relative ${
                activeTab === tab.id
                  ? "text-primary-600 bg-white"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "clothing" && (
            <div>
              <p className="text-sm text-neutral-500 mb-6 text-center">
                جميع القياسات بالسنتيمتر (سم)
              </p>
              <div className="overflow-x-auto rounded-xl border border-neutral-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="text-center py-4 px-4 font-bold text-neutral-900 border-b border-neutral-200">المقاس</th>
                      <th className="text-center py-4 px-4 font-bold text-neutral-900 border-b border-neutral-200">الصدر</th>
                      <th className="text-center py-4 px-4 font-bold text-neutral-900 border-b border-neutral-200">الخصر</th>
                      <th className="text-center py-4 px-4 font-bold text-neutral-900 border-b border-neutral-200">الأرداف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clothingSizes.map((size, idx) => (
                      <tr key={size.label} className={`border-b border-neutral-100 hover:bg-primary-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}`}>
                        <td className="py-4 px-4 font-bold text-primary-600 text-center">{size.label}</td>
                        <td className="py-4 px-4 text-neutral-700 text-center">{size.chest} سم</td>
                        <td className="py-4 px-4 text-neutral-700 text-center">{size.waist} سم</td>
                        <td className="py-4 px-4 text-neutral-700 text-center">{size.hips} سم</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "shoes" && (
            <div>
              <p className="text-sm text-neutral-500 mb-6 text-center">
                جدول تحويل مقاسات الأحذية
              </p>
              <div className="overflow-x-auto rounded-xl border border-neutral-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="text-center py-4 px-3 font-bold text-neutral-900 border-b border-neutral-200">EU</th>
                      <th className="text-center py-4 px-3 font-bold text-neutral-900 border-b border-neutral-200">US</th>
                      <th className="text-center py-4 px-3 font-bold text-neutral-900 border-b border-neutral-200">UK</th>
                      <th className="text-center py-4 px-3 font-bold text-neutral-900 border-b border-neutral-200">CM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoeSizes.map((size, idx) => (
                      <tr key={size.eu} className={`border-b border-neutral-100 hover:bg-primary-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}`}>
                        <td className="py-3 px-3 font-bold text-primary-600 text-center">{size.eu}</td>
                        <td className="py-3 px-3 text-neutral-700 text-center">{size.us}</td>
                        <td className="py-3 px-3 text-neutral-700 text-center">{size.uk}</td>
                        <td className="py-3 px-3 text-neutral-700 text-center">{size.cm} سم</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "howToMeasure" && (
            <div className="space-y-5">
              {[
                {
                  title: "قياس الصدر",
                  desc: "قس حول الجزء الأكبر من صدرك مع الحفاظ على شريط القياس أفقياً",
                  icon: User,
                },
                {
                  title: "قياس الخصر",
                  desc: "قس حول الجزء الأضيق من خصرك مع الحفاظ على شريط القياس أفقياً",
                  icon: User,
                },
                {
                  title: "قياس الأرداف",
                  desc: "قس حول الجزء الأكبر من أردافك مع الحفاظ على شريط القياس أفقياً",
                  icon: User,
                },
                {
                  title: "قياس طول القدم",
                  desc: "قف على ورقة وقم بتحديد طرف أطول إصبع ومؤخرة الكعب. قس المسافة بين العلامتين",
                  icon: Footprints,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">{item.title}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 mt-6">
                <p className="text-sm text-primary-800 font-medium text-center">
                  💡 نصيحة: إذا كنت بين مقاسين، ننصح باختيار المقاس الأكبر للحصول على راحة أكثر
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
