import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// Supported locales
export const locales = ['en', 'es'] as const;
export type Locale = typeof locales[number];

// Default locale
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async () => {
    // Get the user's preferred language from headers
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');

    // Parse the accept-language header to get the preferred locale
    let locale: Locale = defaultLocale;

    if (acceptLanguage) {
        // Extract the first language code (e.g., "en-US" -> "en")
        const preferredLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();

        // Check if it's a supported locale
        if (locales.includes(preferredLang as Locale)) {
            locale = preferredLang as Locale;
        }
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
