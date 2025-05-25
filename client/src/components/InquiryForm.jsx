import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";

const InquiryForm = ({
  form,
  onChange,
  onSubmit,
  loading,
  error,
  success,
  showExtraFields = true,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <form
      className="space-y-3"
      onSubmit={onSubmit}
      dir="rtl"
      aria-label={t.inquiryForm}
    >
      {error && (
        <div className="text-red-600 text-center font-bold mb-2" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-700 text-center font-bold py-10 text-lg">
          {t.inquirySentSuccess}
        </div>
      )}
      {!success && (
        <>
          <div>
            <label
              className="block mb-1 font-semibold"
              htmlFor="inquiry-message"
            >
              {t.message}<span className="text-red-500">*</span>
            </label>
            <textarea
              id="inquiry-message"
              className="w-full border rounded p-2 resize-none h-24"
              name="message"
              value={form.message}
              onChange={onChange}
              required
              aria-required="true"
              aria-label={t.message}
            />
          </div>
          <input
            className="w-full border rounded p-2"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder={`${t.name}*`}
            required
            aria-required="true"
            aria-label={t.name}
          />
          <input
            className="w-full border rounded p-2"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder={`${t.email}*`}
            required
            aria-required="true"
            aria-label={t.email}
          />
          <input
            className="w-full border rounded p-2"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder={t.phone}
            aria-label={t.phone}
          />
          {showExtraFields && (
            <>
              <input
                className="w-full border rounded p-2"
                name="company"
                value={form.company}
                onChange={onChange}
                placeholder={t.company}
                aria-label={t.company}
              />
              <input
                className="w-full border rounded p-2"
                name="zip"
                value={form.zip}
                onChange={onChange}
                placeholder={t.zipCode}
                aria-label={t.zipCode}
              />
              <input
                className="w-full border rounded p-2"
                name="country"
                value={form.country}
                onChange={onChange}
                placeholder={t.country}
                aria-label={t.country}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDealer"
                  name="isDealer"
                  checked={form.isDealer}
                  onChange={onChange}
                  className="rounded text-blue-600"
                />
                <label htmlFor="isDealer" className="text-sm">
                  {t.iAmDealer}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="receiveOffers"
                  name="receiveOffers"
                  checked={form.receiveOffers}
                  onChange={onChange}
                  className="rounded text-blue-600"
                />
                <label htmlFor="receiveOffers" className="text-sm">
                  {t.receiveOffers}
                </label>
              </div>
            </>
          )}
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? t.sending : t.send}
          </button>
        </>
      )}
    </form>
  );
};

export default InquiryForm;
