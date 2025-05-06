
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from "@/components/ui/enhanced-card";
import { Enfant } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  User, Calendar, MapPin, School, Users, Activity, Heart, 
  Phone, Briefcase, FileText, Flag, ClipboardCheck, PenTool,
  Smile
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enfant: Enfant | null;
}

const EnfantDetailsModal: React.FC<Props> = ({ open, onOpenChange, enfant }) => {
  const { t } = useLanguage();
  
  if (!enfant) return null;
  
  const detailItems = [
    { icon: User, label: t('children.fullName'), value: enfant.name },
    { icon: Calendar, label: t('children.birthDate'), value: enfant.date_naissance },
    { icon: MapPin, label: "Birthplace", value: enfant.lieu_naissance },
    { icon: User, label: t('auth.gender'), value: enfant.sexe },
    { icon: School, label: t('children.schoolLevel'), value: enfant.niveau_scolaire },
    { icon: Users, label: "Brothers", value: enfant.nombre_freres },
    { icon: Users, label: "Sisters", value: enfant.nombre_soeurs },
    { icon: Activity, label: "Family Rank", value: enfant.rang_familial },
    { icon: User, label: "Father Name", value: enfant.nom_pere },
    { icon: User, label: "Mother Name", value: enfant.nom_mere },
    { icon: Phone, label: "Parent Contact", value: enfant.contact_parent },
    { icon: Briefcase, label: "Parent Profession", value: enfant.profession_parent },
    { icon: Flag, label: t('children.region'), value: enfant.region },
    { icon: Heart, label: t('children.medicalExamDate'), value: enfant.date_examen_medical },
    { icon: ClipboardCheck, label: "Medical Result", value: enfant.resultat_examen },
    { icon: Smile, label: "Floss", value: enfant.floss },
    { icon: Activity, label: "Status", value: enfant.status },
    { icon: FileText, label: t('children.participations'), value: enfant.participation_count },
    { icon: PenTool, label: "Notes", value: enfant.notes }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{t('children.details')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <EnhancedCard gradient>
            <EnhancedCardHeader 
              title={`${t('children.details')} #${enfant.id}`}
              className="border-b border-border/10 bg-background/50 py-3"
            />
            <EnhancedCardContent>
              {enfant.photo && (
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24 overflow-hidden rounded-full border-2 border-primary/30 shadow-lg">
                    <img src={enfant.photo} alt="child" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {detailItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm border border-border/10 hover:bg-background/60 transition-colors"
                  >
                    <div className="mt-0.5">
                      <item.icon className="h-4 w-4 text-primary/70" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
                      <div className="text-sm">{item.value || 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
          
          <DialogFooter>
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-primary/90 hover:bg-primary text-primary-foreground"
              size="sm"
            >
              {t('children.close')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnfantDetailsModal;
