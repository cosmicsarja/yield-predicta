import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import { languages } from "@/components/LanguageSelector";
import { ScrollArea } from "@/components/ui/scroll-area";

export const FloatingLanguageButton = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("preferredLanguage", langCode);
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr";
  };

  const indiaLangs = languages.filter(l => l.region === "India");
  const worldLangs = languages.filter(l => l.region === "World");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full shadow-strong z-50 md:hidden"
        >
          <Languages className="h-5 w-5 mr-2" />
          Language
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>🌍 Choose Language</SheetTitle>
          <SheetDescription>
            Select your preferred language
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[70vh] mt-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">🇮🇳 Indian Languages</p>
              <div className="grid grid-cols-3 gap-2">
                {indiaLangs.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={lang.code === i18n.language ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium text-xs">{lang.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">🌍 World Languages</p>
              <div className="grid grid-cols-3 gap-2">
                {worldLangs.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={lang.code === i18n.language ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium text-xs">{lang.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
