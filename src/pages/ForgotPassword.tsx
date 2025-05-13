
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/Logo';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    t,
    direction
  } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For now, just show a success message
      toast.success(t('auth.resetEmailSent'), {
        description: t('auth.checkEmailForInstructions')
      });
    } catch (error) {
      toast.error(t('error.resetPasswordFailed'), {
        description: t('error.tryAgainLater')
      });
    } finally {
      setLoading(false);
    }
  };

  return <div dir={direction} className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-4" />
          <p className="text-ogec-secondary mt-2">{t('general.appFullName')}</p>
        </div>

        <Card className="border-ogec-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('auth.forgotPassword')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.enterEmailForReset')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('auth.email')}
                </Label>
                <Input id="email" type="email" placeholder={t('auth.emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required autoFocus className={direction === 'rtl' ? 'text-right' : ''} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-ogec-primary hover:bg-ogec-primary/90" disabled={loading}>
                <Mail className={direction === 'rtl' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
                {loading ? t('auth.sendingResetLink') : t('auth.sendResetLink')}
              </Button>
              
              <div className="text-center text-sm">
                <Link to="/login" className="text-ogec-primary hover:underline">
                  {t('auth.backToLogin')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>;
};
export default ForgotPassword;
