
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfilePictureUploadProps {
  profile: any;
  onUpload: (file: File) => void;
}

const ProfilePictureUpload = ({ profile, onUpload }: ProfilePictureUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Use storage URL if profile_picture field exists, removing duplicate 'profiles/'
  const actualPicUrl =
    previewUrl ||
    (profile?.profile_picture
      ? `http://localhost:8000/storage/profiles/${profile.profile_picture.replace(/^profiles\//, '')}`
      : profile?.avatar_url) ||
    '/placeholder.svg';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Call the onUpload function with the file
      onUpload(file);
      
      // Also create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <h3 className="text-xl font-semibold">{profile.name || t('profile.user')}</h3>
        <p className="text-sm text-muted-foreground">
          {t(`roles.${profile.role?.toLowerCase()}`) || t('profile.notSpecified')}
        </p>
      </CardHeader>
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-muted bg-muted flex items-center justify-center">
            <img
              src={actualPicUrl}
              alt={profile.name || t('profile.user')}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              className="absolute bottom-2 right-2 flex items-center justify-center bg-white shadow-md rounded-full p-1.5 border border-gray-200 hover:bg-primary/10 transition"
              onClick={handleUploadClick}
              aria-label={t('profile.changeImage')}
              style={{ zIndex: 2 }}
            >
              <Pin className="h-5 w-5 text-primary" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
        <Button variant="outline" className="mt-2 w-full" onClick={handleUploadClick}>
          {profile.profile_picture || profile.avatar_url
            ? t('profile.changeImage')
            : t('profile.uploadImage')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
