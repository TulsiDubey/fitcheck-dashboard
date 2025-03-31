
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Globe } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const languages: { label: string; value: Language }[] = [
    { label: 'English', value: 'english' },
    { label: 'हिंदी', value: 'hindi' },
    { label: 'मराठी', value: 'marathi' },
  ];

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-medical-500">
          <AvatarImage src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop" alt="Doctor profile" />
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-lg">{t('dr')} {user?.name || 'Jane Smith'}</h2>
          <p className="text-sm text-gray-500">{t('cardiologist')} • +1 234 567 890</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Globe className="h-4 w-4 mr-1" />
              {language === 'english' ? 'English' : language === 'hindi' ? 'हिंदी' : 'मराठी'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.value} 
                onClick={() => setLanguage(lang.value)}
                className={language === lang.value ? "bg-muted" : ""}
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-1" />
          {t('logout')}
        </Button>
      </div>
    </header>
  );
};

export default Header;
