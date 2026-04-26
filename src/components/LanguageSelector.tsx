import { useTranslation } from "react-i18next";
import { Languages, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const languages = [
  { code: "en", name: "English", flag: "🇬🇧", region: "India" },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳", region: "India" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳", region: "India" },
  { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳", region: "India" },
  { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳", region: "India" },
  { code: "ml", name: "മലയാളം (Malayalam)", flag: "🇮🇳", region: "India" },
  { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳", region: "India" },
  { code: "gu", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳", region: "India" },
  { code: "bn", name: "বাংলা (Bengali)", flag: "🇮🇳", region: "India" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", flag: "🇮🇳", region: "India" },
  { code: "or", name: "ଓଡ଼ିଆ (Odia)", flag: "🇮🇳", region: "India" },
  { code: "as", name: "অসমীয়া (Assamese)", flag: "🇮🇳", region: "India" },
  { code: "es", name: "Español", flag: "🇪🇸", region: "World" },
  { code: "fr", name: "Français", flag: "🇫🇷", region: "World" },
  { code: "ar", name: "العربية", flag: "🇸🇦", region: "World" },
  { code: "pt", name: "Português", flag: "🇧🇷", region: "World" },
  { code: "ru", name: "Русский", flag: "🇷🇺", region: "World" },
  { code: "zh", name: "中文", flag: "🇨🇳", region: "World" },
  { code: "ja", name: "日本語", flag: "🇯🇵", region: "World" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", region: "World" },
  { code: "ko", name: "한국어", flag: "🇰🇷", region: "World" },
  { code: "id", name: "Indonesia", flag: "🇮🇩", region: "World" },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("preferredLanguage", langCode);
    // Handle RTL for Arabic
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr";
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const indiaLangs = languages.filter(l => l.region === "India");
  const worldLangs = languages.filter(l => l.region === "World");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="transition-smooth gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">{currentLanguage.flag} {currentLanguage.name}</span>
          <Languages className="h-4 w-4 sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <ScrollArea className="h-80">
          <DropdownMenuLabel className="text-xs text-muted-foreground">🇮🇳 Indian Languages</DropdownMenuLabel>
          {indiaLangs.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`cursor-pointer ${lang.code === i18n.language ? "bg-primary/10 text-primary font-medium" : ""}`}
            >
              <span className="mr-2 text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.code === i18n.language && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">🌍 World Languages</DropdownMenuLabel>
          {worldLangs.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`cursor-pointer ${lang.code === i18n.language ? "bg-primary/10 text-primary font-medium" : ""}`}
            >
              <span className="mr-2 text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.code === i18n.language && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
