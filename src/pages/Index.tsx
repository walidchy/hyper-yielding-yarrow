
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Logo } from '@/components/Logo';
import { Home, User, Calendar, FileText, Users, LogIn, Facebook, MessageSquare } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import VideoPlayer from '@/components/VideoPlayer';
import { MapPin, MapPinHouse } from 'lucide-react';
import { ThemeToggle } from '@/contexts/ThemeContext';

const Index = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: <User size={24} />,
      title: t('navigation.profile'),
      description: t('profile.yourPersonalDetails'),
      delay: 100
    },
    {
      icon: <Calendar size={24} />,
      title: t('navigation.programs'),
      description: t('programs.description'),
      delay: 200
    },
    {
      icon: <FileText size={24} />,
      title: t('navigation.cartesTechniques'),
      description: t('carteTechnique.manage'),
      delay: 300
    },
    {
      icon: <Users size={24} />,
      title: t('navigation.children'),
      description: t('children.managementDescription'),
      delay: 400
    },
    {
      icon: <Users size={24} />,
      title: t('navigation.teams'),
      description: t('teams.updateDescription'),
      delay: 500
    },
    {
      icon: <Home size={24} />,
      title: t('navigation.dashboard'),
      description: t('dashboard.overview'),
      delay: 600
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#2563eb]/10 via-[#64748b]/10 to-[#06b6d4]/10 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-[#2563eb]/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="sm" collapsed={false} />
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.facebook.com/profile.php?id=100088273427239&mibextid=rS40aB7S9Ucbxw6v"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563eb] hover:text-[#2563eb]/80 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://wa.me/212767616897"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:text-[#25D366]/80 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <ThemeToggle />
            <LanguageSwitcher variant="ghost" size="sm" showText={true} />
            <Button 
              variant="default"
              size="sm"
              className="bg-[#2563eb] hover:bg-[#2563eb]/90 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => navigate('/login')}
            >
              <LogIn size={16} />
              {t('auth.login')}
            </Button>
          </div>
        </div>
      </header>
      
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2563eb]/5 to-transparent pointer-events-none" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#2563eb] via-[#64748b] to-[#06b6d4] bg-clip-text text-transparent animate-fade-in">
            {t('general.appFullName')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            {t('dashboard.welcome')}
          </p>
          
          <div className="max-w-4xl mx-auto mb-12 rounded-xl overflow-hidden shadow-2xl">
            <VideoPlayer 
              src="/home-video.mp4"
              autoPlay
              muted
              loop
              controls
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="default" 
              size="lg"
              className="bg-gradient-to-r from-[#2563eb] to-[#06b6d4] hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
              onClick={() => navigate('/login')}
            >
              <LogIn size={18} />
              {t('auth.login')}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-[#2563eb] hover:bg-[#2563eb]/5 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
              onClick={() => navigate('/register')}
            >
              {t('auth.register')}
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-transparent via-[#2563eb]/5 to-transparent backdrop-blur-sm">
        <div className="container mx-auto">
          <EnhancedCard className="max-w-4xl mx-auto transform hover:-translate-y-1 transition-all duration-500 shadow-xl hover:shadow-2xl border-t-4 border-[#2563eb]" gradient>
            <EnhancedCardHeader>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-[#2563eb]/10 rounded-full">
                  <MapPinHouse className="w-10 h-10 text-[#2563eb] animate-float" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent">
                  OGEC
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-[#2563eb]" />
                  <p className="text-lg md:text-xl font-medium">
                    {t('organization.headquarters')}
                  </p>
                </div>
              </div>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="space-y-8 text-center">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('organization.description')}
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="inline-block px-6 py-3 bg-[#2563eb]/10 rounded-xl transform hover:scale-105 transition-transform duration-300">
                    <p className="text-lg font-semibold text-[#2563eb]">
                      {t('organization.activities')}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('organization.established')}
                  </div>
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      </section>
      
      <section className="py-16 md:py-24 px-4 bg-gradient-to-t from-background/50 to-transparent">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#2563eb] via-[#64748b] to-[#06b6d4] bg-clip-text text-transparent">
            {t('directorr.welcome')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <EnhancedCard
                key={index}
                hoverEffect
                className={`transform hover:-translate-y-2 transition-all duration-300 border-t-2 border-[#2563eb]/20 bg-card/50 backdrop-blur-sm animate-fade-in`}
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <EnhancedCardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#2563eb]/10 text-[#2563eb] transform hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </EnhancedCardContent>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/50 via-[#2563eb]/5 to-transparent">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent">
            {t('auth.dontHaveAccount')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('auth.enterCredentials')}
          </p>
          <Button 
            variant="default" 
            size="lg"
            className="bg-gradient-to-r from-[#2563eb] to-[#06b6d4] hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            onClick={() => navigate('/register')}
          >
            {t('auth.register')}
          </Button>
        </div>
      </section>
      
      <footer className="py-8 px-4 bg-card/50 backdrop-blur-sm border-t border-border/50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="sm" collapsed={false} />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t('general.appName')}
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <LanguageSwitcher variant="ghost" showText={true} />
            <p className="text-sm text-muted-foreground">
              {t('general.appFullName')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
