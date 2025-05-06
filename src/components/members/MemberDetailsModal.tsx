
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Member } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  User, Mail, Phone, Award, 
  Calendar, Clock, IdCard, MapPin, 
  Star, Activity
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
}

const MemberDetailsModal: React.FC<Props> = ({ open, onOpenChange, member }) => {
  const { t } = useLanguage();
  
  if (!member) return null;
  
  // Profile picture URL construction (same logic that would be in DashboardLayout)
  const profilePicture = member.profile_picture 
    ? `http://localhost:8000/storage/profiles/${member.profile_picture.replace(/^profiles\//, '')}`
    : '/placeholder.svg';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t('members.details', ['Member Details'])}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Member Header with Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="w-24 h-24">
              <AspectRatio ratio={1/1} className="bg-muted">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profilePicture} alt={member.name} className="object-cover" />
                  <AvatarFallback className="text-2xl">
                    {member.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </AspectRatio>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold">{member.name}</h3>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mt-1">
                <Award className="h-4 w-4" />
                <span className="capitalize">{t(`members.roles.${member.role}`, [member.role])}</span>
              </div>
              
              {/* Status Badge */}
              {member.status && (
                <div className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${
                    member.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></span>
                  {member.status}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="text-md font-semibold border-b pb-2">{t('profile.contactInfo', ['Contact Information'])}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('members.table.email', ['Email'])}</p>
                    <p>{member.email || t('profile.notSpecified', ['Not specified'])}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('members.table.phone', ['Phone'])}</p>
                    <p>{member.phone || t('profile.notSpecified', ['Not specified'])}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <IdCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">CIN</p>
                    <p>{member.cin || t('profile.notSpecified', ['Not specified'])}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('members.table.address', ['Address'])}</p>
                    <p>{member.address || t('profile.notSpecified', ['Not specified'])}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="text-md font-semibold border-b pb-2">{t('profile.additionalInfo', ['Additional Information'])}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('members.table.gender', ['Gender'])}</p>
                    <p className="capitalize">{member.gender || t('profile.notSpecified', ['Not specified'])}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('members.table.certification', ['Certification'])}</p>
                    <p>{member.certification || t('profile.notSpecified', ['Not specified'])}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('members.table.joinYear', ['Join Year'])}</p>
                    <p>{member.join_year || t('profile.notSpecified', ['Not specified'])}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">ID</p>
                    <p>{member.id}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 md:col-span-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('members.table.dates', ['Registration Dates'])}</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <p>{t('members.table.createdAt', ['Created'])}: {member.created_at || t('profile.notSpecified', ['Not specified'])}</p>
                      <p>{t('members.table.updatedAt', ['Updated'])}: {member.updated_at || t('profile.notSpecified', ['Not specified'])}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            {t('general.close', ['Close'])}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDetailsModal;
