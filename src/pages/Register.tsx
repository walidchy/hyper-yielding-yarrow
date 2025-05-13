import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import AccountPendingModal from '@/components/AccountPendingModal';
import { Logo } from '@/components/Logo';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { z } from "zod";
import { useLanguage } from '@/contexts/LanguageContext';

const Register = () => {
  const {
    t
  } = useLanguage();
  
  const registerSchema = z.object({
    name: z.string().min(3, t('validation.nameMinLength')),
    email: z.string().email(t('validation.emailInvalid')),
    password: z.string().min(8, t('validation.passwordMinLength')),
    password_confirmation: z.string(),
    role: z.string(),
    gender: z.enum(['M', 'F']).optional(),
    phone: z.string().optional(),
    address: z.string().optional()
  }).refine(data => data.password === data.password_confirmation, {
    message: t('validation.passwordsMustMatch'),
    path: ["password_confirmation"]
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'normal' as UserRole,
    gender: undefined as 'M' | 'F' | undefined,
    phone: '',
    address: ''
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    role?: string;
    gender?: string;
  }>({});
  
  const [formError, setFormError] = useState<string | null>(null);
  
  const {
    register,
    loading,
    pendingModalOpen,
    setPendingModalOpen
  } = useAuth();
  
  const navigate = useNavigate();
  
  const {
    toast
  } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {
          [key: string]: string;
        } = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
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
    if (!validateForm()) {
      return;
    }
    try {
      await register(formData);
      // Registration is handled in the context now, which will show the pending modal
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response?.status === 422) {
        if (error.response?.data?.errors) {
          const apiErrors: {
            [key: string]: string;
          } = {};
          Object.entries(error.response.data.errors).forEach(([key, value]) => {
            apiErrors[key] = Array.isArray(value) ? value[0] : String(value);
          });
          setErrors(apiErrors);
        } else {
          setFormError(t('validation.checkInformation'));
        }
      } else if (error.response?.data?.message) {
        setFormError(error.response.data.message);
      } else if (error.message) {
        setFormError(error.message);
      } else {
        setFormError(t('validation.registrationFailed'));
      }
      
      // Show toast for network errors
      if (!error.response) {
        toast({
          variant: "destructive",
          title: t('errors.networkError'),
          description: t('errors.checkInternetConnection')
        });
      }
    }
  };
  
  return <div className="min-h-screen flex items-center justify-center p-4 py-10 bg-transparent">
      <AccountPendingModal open={pendingModalOpen} onClose={() => {
      setPendingModalOpen(false);
      navigate('/login');
    }} />
      
      <div className="max-w-lg w-full animate-fade-in">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="lg" className="mx-auto" />
          <p className="text-ogec-secondary mt-2">{t('general.appFullName')}</p>
        </div>

        <Card className="border-ogec-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('auth.createAccount')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.fillDetails')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {formError && <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.fullName')}</Label>
                  <Input id="name" name="name" placeholder={t('auth.namePlaceholder')} value={formData.name} onChange={handleChange} className={errors.name ? "border-destructive" : ""} required />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input id="email" name="email" type="email" placeholder={t('auth.emailPlaceholder')} value={formData.email} onChange={handleChange} className={errors.email ? "border-destructive" : ""} required />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className={errors.password ? "border-destructive" : ""} required />
                  {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">{t('auth.confirmPassword')}</Label>
                  <Input id="password_confirmation" name="password_confirmation" type="password" placeholder="••••••••" value={formData.password_confirmation} onChange={handleChange} className={errors.password_confirmation ? "border-destructive" : ""} required />
                  {errors.password_confirmation && <p className="text-sm text-destructive mt-1">{errors.password_confirmation}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">{t('auth.role')}</Label>
                  <Select onValueChange={(value: string) => handleSelectChange('role', value as UserRole)} defaultValue={formData.role}>
                    <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                      <SelectValue placeholder={t('auth.selectRole')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="director">{t('roles.director')}</SelectItem>
                      <SelectItem value="educateur">{t('roles.educateur')}</SelectItem>
                      <SelectItem value="chef_groupe">{t('roles.chefGroupe')}</SelectItem>
                      <SelectItem value="infirmier">{t('roles.infirmier')}</SelectItem>
                      <SelectItem value="animateur_general">{t('roles.animateurGeneral')}</SelectItem>
                      <SelectItem value="postman">{t('roles.postman')}</SelectItem>
                      <SelectItem value="normal">{t('roles.normalUser')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-destructive mt-1">{errors.role}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t('auth.gender')}</Label>
                  <RadioGroup className="flex pt-2" onValueChange={(value: 'M' | 'F') => handleSelectChange('gender', value)} value={formData.gender}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="male" />
                      <Label htmlFor="male">{t('general.male')}</Label>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <RadioGroupItem value="F" id="female" />
                      <Label htmlFor="female">{t('general.female')}</Label>
                    </div>
                  </RadioGroup>
                  {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('auth.phoneOptional')}</Label>
                  <Input id="phone" name="phone" placeholder={t('auth.phonePlaceholder')} value={formData.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t('auth.addressOptional')}</Label>
                  <Input id="address" name="address" placeholder={t('auth.addressPlaceholder')} value={formData.address} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full bg-ogec-primary hover:bg-ogec-primary/90" disabled={loading}>
                {loading ? t('auth.registering') : t('auth.register')}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-ogec-primary hover:underline">
                  {t('auth.login')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>;
};
export default Register;
