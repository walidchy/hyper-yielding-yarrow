
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AccountPendingModal from "@/components/AccountPendingModal";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Logo } from '@/components/Logo';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, LockIcon } from "lucide-react";
import { z } from "zod";

const Login = () => {
  const { t } = useLanguage();
  
  const loginSchema = z.object({
    email: z.string().email(t('validation.emailInvalid')),
    password: z.string().min(8, t('validation.passwordMinLength'))
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const {
    login,
    loading,
    pendingModalOpen,
    setPendingModalOpen
  } = useAuth();
  
  useEffect(() => {
    if (formError) {
      setFormError(null);
    }
  }, [email, password]);
  
  const validateForm = () => {
    try {
      loginSchema.parse({
        email,
        password
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {
          email?: string;
          password?: string;
        } = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0] as 'email' | 'password'] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!validateForm() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    setLoginAttempts(prev => prev + 1);
    
    try {
      console.log(`Login attempt #${loginAttempts + 1}`);
      await login(email, password);
    } catch (error: any) {
      console.error('Login form error:', error);
      // Display the error message from the API if available, otherwise use a generic message
      setFormError(error.message || t('validation.credentialsError'));
      
      // If multiple login attempts fail, provide more guidance
      if (loginAttempts >= 2) {
        setFormError(`${error.message || t('validation.credentialsError')}. ${t('validation.checkCredentials')}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <AccountPendingModal open={pendingModalOpen} onClose={() => setPendingModalOpen(false)} />
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="lg" className="mx-auto" />
          <p className="text-ogec-secondary mt-2">{t('general.appFullName')}</p>
        </div>

        <Card className="border-ogec-border shadow-lg">
          <CardHeader>
            <div className="flex justify-end">
              <LanguageSwitcher variant="ghost" showText={false} />
            </div>
            <CardTitle className="text-2xl text-center">{t('auth.login')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.enterCredentials')}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {formError && <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t('auth.email')}
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={t('auth.emailPlaceholder')} 
                  value={email} 
                  onChange={e => setEmail(e.target.value.trim())} 
                  className={errors.email ? "border-destructive" : ""} 
                  autoComplete="email" 
                  autoFocus 
                  disabled={isSubmitting} 
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <LockIcon className="h-4 w-4" />
                    {t('auth.password')}
                  </Label>
                  <Link to="/forgot-password" className="text-sm text-ogec-primary hover:underline">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className={errors.password ? "border-destructive" : ""} 
                  autoComplete="current-password" 
                  disabled={isSubmitting} 
                />
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-ogec-primary hover:bg-ogec-primary/90" 
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? t('auth.loggingIn') : t('auth.login')}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                {t('auth.dontHaveAccount')}{' '}
                <Link to="/register" className="text-ogec-primary hover:underline">
                  {t('auth.register')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>;
};

export default Login;
