"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function FAQPage() {
  const t = useTranslations("faq");
  const tCommon = useTranslations("common");

  const breadcrumbItems = [
    { label: tCommon('home'), href: "/" },
    { label: t('title'), href: "/faq" },
  ];

  const faqs = [
    {
      question: t('q1.q'),
      answer: t('q1.a')
    },
    {
      question: t('q2.q'),
      answer: t('q2.a')
    },
    {
      question: t('q3.q'),
      answer: t('q3.a')
    },
    {
      question: t('q4.q'),
      answer: t('q4.a')
    },
    {
      question: t('q5.q'),
      answer: t('q5.a')
    },
    {
      question: t('q6.q'),
      answer: t('q6.a')
    },
    {
      question: t('q7.q'),
      answer: t('q7.a')
    },
    {
      question: t('q8.q'),
      answer: t('q8.a')
    },
    {
      question: t('q9.q'),
      answer: t('q9.a')
    },
    {
      question: t('q10.q'),
      answer: t('q10.a')
    }
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="font-outfit text-4xl font-extrabold text-neutral-900 mb-4 uppercase tracking-tight">{t('title')}</h1>
        <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
          {t('subtitle')}
        </p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-white rounded-xl shadow-lg border border-neutral-200 group">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors list-none flex items-center justify-between">
                {faq.question}
                <span className="transform group-open:rotate-180 transition-transform text-neutral-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-4 text-neutral-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
        
        <div className="mt-12 bg-primary-50 rounded-xl border border-primary-200 p-6">
          <h2 className="font-outfit text-2xl font-extrabold text-neutral-900 mb-2 uppercase tracking-wide">{t('stillHaveQuestions')}</h2>
          <p className="text-neutral-600 mb-4 leading-relaxed">
            {t('stillHaveQuestionsDesc')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
          >
            {t('contactUs')}
          </Link>
        </div>
      </div>
    </div>
  );
}
