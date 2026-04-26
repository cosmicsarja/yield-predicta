import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { languages } from "@/components/LanguageSelector";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LanguagePreferenceModal = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("languagePreferenceSet");
    if (!hasSeenModal) {
      setOpen(true);
    }
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("languagePreferenceSet", "true");
    localStorage.setItem("preferredLanguage", langCode);
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr";
    setOpen(false);
    toast.success("Language preference saved!");
  };

  const indiaLangs = languages.filter(l => l.region === "India");
  const worldLangs = languages.filter(l => l.region === "World");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            🌍 Choose Your Language
          </DialogTitle>
          <DialogDescription className="text-center">
            Select your preferred language for the best experience
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-4 mt-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">🇮🇳 Indian Languages</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {indiaLangs.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={lang.code === i18n.language ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-smooth text-xs"
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">🌍 World Languages</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {worldLangs.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={lang.code === i18n.language ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-smooth text-xs"
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
