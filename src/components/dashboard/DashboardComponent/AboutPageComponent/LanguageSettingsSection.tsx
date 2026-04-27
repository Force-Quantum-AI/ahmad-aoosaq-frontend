import { useEffect, useState } from "react";
import { CircleCheck, Info, Loader2 } from "lucide-react";
import { useGetAllLanguageQuery, useSetLanguageMutation } from "@/store/features/agent/agent.api";
import { Skeleton } from "@/components/ui/skeleton";


interface Language {
  id: number;
  business: number;
  agent: number;
  language: string;
  is_greeting: boolean;
  is_default: boolean;
}

const languageNames: Record<string, string> = {
  en: "English",
  es: "Spanish",
  ar: "Arabic",
  ru: "Russian",
};

export default function LanguageSettingsSection() {
  const { data: languages = [], isLoading: isFetching } = useGetAllLanguageQuery({});
  const [setLanguage, { isLoading: isUpdating }] = useSetLanguageMutation();

  // Local state
  const [selectedSupported, setSelectedSupported] = useState<number[]>([]);
  const [selectedDefault, setSelectedDefault] = useState<number | null>(null);
  const [multilingualEnabled, setMultilingualEnabled] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync API → state
  useEffect(() => {
    if (languages && languages.length > 0) {
      // Get all languages with is_greeting=true (supported languages)
      const supported = languages
        .filter((lang: Language) => lang.is_greeting)
        .map((lang: Language) => lang.id);
      setSelectedSupported(supported);

      // Get default language (is_default=true)
      const defaultLang = languages.find((lang: Language) => lang.is_default);
      if (defaultLang) {
        setSelectedDefault(defaultLang.id);
      }

      // Check if multilingual is enabled (if any language has is_greeting=true)
      const hasMultilingual = languages.some((lang: Language) => lang.is_greeting);
      setMultilingualEnabled(hasMultilingual);
    }
  }, [languages]);

  // Toggle multilingual mode
  const handleMultilingualMode = async () => {
    const newValue = !multilingualEnabled;
    setMultilingualEnabled(newValue);

    try {
      // If disabling multilingual, set all to is_greeting=false
      if (newValue === false) {
        const greetingLangs = languages.filter(
          (lang: Language) => lang.is_greeting
        );
        
        for (const lang of greetingLangs) {
          await setLanguage({
            id: lang.id,
            data: {
              language: lang.language,
              is_greeting: false,
              is_default: false,
            },
          }).unwrap();
        }
        setSelectedSupported([]);
        setSelectedDefault(null);
      } else {
        // Enable multilingual - set first language to is_greeting=true
        const firstLang = languages[0];
        if (firstLang) {
          await setLanguage({
            id: firstLang.id,
            data: {
              language: firstLang.language,
              is_greeting: true,
              is_default: true,
            },
          }).unwrap();
        }
      }
    } catch (error) {
      console.error("Error toggling multilingual mode:", error);
      setMultilingualEnabled(!newValue);
      setErrors({
        multilingual: "Failed to update multilingual mode",
      });
    }
  };

  // Handle supported language toggle
  const handleSupportedLanguage = async (languageId: number) => {
    const language = languages.find((lang: Language) => lang.id === languageId);
    if (!language) return;

    const isCurrentlySupported = selectedSupported.includes(languageId);

    try {
      // Toggle is_greeting (true means supported, false means not supported)
      const newIsGreeting = !isCurrentlySupported;
      
      await setLanguage({
        id: languageId,
        data: {
          language: language.language,
          is_greeting: newIsGreeting,
          is_default: newIsGreeting && language.is_default,
        },
      }).unwrap();

      // Update local state
      if (isCurrentlySupported) {
        setSelectedSupported(selectedSupported.filter((id) => id !== languageId));
        if (selectedDefault === languageId) {
          setSelectedDefault(null);
        }
      } else {
        setSelectedSupported([...selectedSupported, languageId]);
      }

      setErrors({});
    } catch (error) {
      console.error("Error updating supported language:", error);
      setErrors({
        supported: "Failed to update supported language",
      });
    }
  };

  // Handle default language selection
  const handleDefaultLanguage = async (languageId: number) => {
    const language = languages.find((lang: Language) => lang.id === languageId);
    if (!language) return;

    // Don't allow selecting if is_greeting is false
    if (!language.is_greeting) {
      setErrors({
        default: "Can only set default language from supported languages",
      });
      return;
    }

    try {
      // If there's a previous default, unset it
      if (selectedDefault && selectedDefault !== languageId) {
        const prevDefault = languages.find(
          (lang: Language) => lang.id === selectedDefault
        );
        if (prevDefault && prevDefault.is_greeting) {
          await setLanguage({
            id: selectedDefault,
            data: {
              language: prevDefault.language,
              is_greeting: prevDefault.is_greeting,
              is_default: false,
            },
          }).unwrap();
        }
      }

      // Set new default
      await setLanguage({
        id: languageId,
        data: {
          language: language.language,
          is_greeting: language.is_greeting,
          is_default: true,
        },
      }).unwrap();

      setSelectedDefault(languageId);
      setErrors({});
    } catch (error) {
      console.error("Error updating default language:", error);
      setErrors({
        default: "Failed to update default language",
      });
    }
  };

  // Get languages available for default (only those with is_greeting=true)
  const availableForDefault = languages.filter(
    (lang: Language) => lang.is_greeting
  );

  if (isFetching) {
    return (
      <div className="mt-6 px-6">
        <div className="flex flex-col md:flex-row gap-3 py-20">
            <Skeleton className="w-full md:w-1/4 h-40 rounded-2xl bg-white/15" />
            <Skeleton className="w-full md:w-1/4 h-40 rounded-2xl bg-white/15" />
            <Skeleton className="w-full md:w-1/4 h-40 rounded-2xl bg-white/15" />
            <Skeleton className="w-full md:w-1/4 h-40 rounded-2xl bg-white/15" />
          </div>
      </div>
    );
  }

  return (
    <div className="mt-6 px-6">
      <div className="rounded-3xl p-8 bg-black">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl text-white mb-2">Language Settings</h2>
          <p className="text-gray-400 text-base">
            Configure language support for your AI agent
          </p>
        </div>

        {/* Toggle Multilingual */}
        <div className="mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl text-white mb-1">Enable Multilingual Support</h3>
              <p className="text-base text-gray-400">
                Agent will support multiple languages
              </p>
            </div>

            {isUpdating ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <button
                onClick={handleMultilingualMode}
                className={`relative inline-flex h-8 w-16 items-center rounded-full px-1 transition-colors ${
                  multilingualEnabled
                    ? "bg-blue-500 justify-end"
                    : "bg-gray-600 justify-start"
                }`}
              >
                <span className="h-6 w-6 rounded-full bg-white" />
              </button>
            )}
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Supported Languages */}
          <div className="md:col-span-2">
            <h3 className="text-lg text-white mb-4">Supported Languages</h3>

            {languages.length === 0 ? (
              <div className="bg-gray-900 p-6 rounded-xl text-center text-gray-400">
                No languages available
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang: Language) => {
                  const isSupported = selectedSupported.includes(lang.id);

                  return (
                    <button
                      key={lang.id}
                      onClick={() => handleSupportedLanguage(lang.id)}
                      disabled={isUpdating}
                      className={`p-4 rounded-xl flex items-center justify-between transition-all ${
                        isSupported
                          ? "bg-blue-500/20 border border-blue-500/50 hover:border-blue-500"
                          : "bg-gray-900 border border-gray-800 hover:border-gray-700"
                      } cursor-pointer ${
                        isUpdating ? "opacity-50" : ""
                      }`}
                    >
                      <span className="text-white font-medium">
                        {languageNames[lang.language] || lang.language.toUpperCase()}
                      </span>
                      {isSupported && <CircleCheck className="text-blue-400" size={20} />}
                    </button>
                  );
                })}
              </div>
            )}

            {errors.supported && (
              <p className="text-red-400 text-sm mt-3">{errors.supported}</p>
            )}
          </div>

          {/* Default Language */}
          <div>
            <h3 className="text-lg text-white mb-4">Default Language</h3>

            {availableForDefault.length === 0 ? (
              <div className="bg-gray-900 p-6 rounded-xl text-center text-gray-400 text-sm">
                <p>No supported languages yet</p>
                <p className="text-xs mt-2">Enable languages in supported section first</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableForDefault.map((lang: Language) => {
                  const isSelected = selectedDefault === lang.id;

                  return (
                    <button
                      key={lang.id}
                      onClick={() => handleDefaultLanguage(lang.id)}
                      disabled={isUpdating}
                      className={`w-full p-3 rounded-xl flex justify-between items-center transition-all ${
                        isSelected
                          ? "bg-emerald-500/20 border border-emerald-500/50 hover:border-emerald-500"
                          : "bg-gray-900 border border-gray-800 hover:border-gray-700"
                      } ${isUpdating ? "opacity-50" : "cursor-pointer"}`}
                    >
                      <span className="text-white font-medium">
                        {languageNames[lang.language] || lang.language.toUpperCase()}
                      </span>
                      {isSelected && <CircleCheck className="text-emerald-400" size={20} />}
                    </button>
                  );
                })}
              </div>
            )}

            {errors.default && (
              <p className="text-red-400 text-sm mt-3">{errors.default}</p>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 space-y-4">
          {multilingualEnabled && (
            <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-700/30">
              <h4 className="text-blue-400 flex gap-2 items-center">
                <Info size={16} /> Multilingual Mode Enabled
              </h4>
              <p className="text-sm text-gray-300 mt-1">
                Your agent can now detect and respond in multiple languages. Select a default
                language for responses when the user's language is unclear.
              </p>
            </div>
          )}

          {selectedDefault && (
            <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-700/30">
              <h4 className="text-emerald-400 flex gap-2 items-center">
                <Info size={16} /> Default Language Set
              </h4>
              <p className="text-sm text-gray-300 mt-1">
                {languageNames[
                  languages.find((l: Language) => l.id === selectedDefault)
                    ?.language || ""
                ] || "Unknown"}{" "}
                is set as the default language for your agent.
              </p>
            </div>
          )}

          {!multilingualEnabled && (
            <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-700/30">
              <h4 className="text-amber-400 flex gap-2 items-center">
                <Info size={16} /> Multilingual Mode Disabled
              </h4>
              <p className="text-sm text-gray-300 mt-1">
                Enable multilingual support to add more languages to your agent.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}