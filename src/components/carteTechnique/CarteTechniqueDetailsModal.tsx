
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from "@/components/ui/enhanced-card";
import { CarteTechnique } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Activity, Target, Users, MapPin, Clock, FileText, 
  GitBranch, BookOpen, PackageCheck, Lightbulb 
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carte: CarteTechnique | null;
}

const CarteTechniqueDetailsModal: React.FC<Props> = ({ open, onOpenChange, carte }) => {
  const { t } = useLanguage();
  
  if (!carte) return null;

  const detailItems = [
    { icon: Activity, label: t('carteTechnique.activityName'), value: carte.name_nachat },
    { icon: GitBranch, label: t('carteTechnique.activityType'), value: carte.type_nachat },
    { icon: BookOpen, label: "Subject", value: carte.sujet_nachat },
    { icon: Target, label: "Goals", value: carte.goals_nachat },
    { icon: Users, label: "Target Group", value: `${carte.fi2a_mostahdafa} (${carte.gender})` },
    { icon: Users, label: "Participants", value: carte['3adad_monkharitin'] },
    { icon: MapPin, label: t('carteTechnique.location'), value: carte.lieu },
    { icon: Clock, label: t('carteTechnique.time'), value: carte.time }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            {t('carteTechnique.details')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <EnhancedCard gradient>
            <EnhancedCardHeader 
              title={
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>{`${t('carteTechnique.details')} #${carte.id}`}</span>
                </div>
              }
              className="border-b border-border/10 bg-background/50 py-3"
            />
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-2 p-2.5 rounded-lg bg-background/40 backdrop-blur-sm border border-border/10 hover:bg-background/60 transition-colors"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedCard gradient className="h-full">
              <EnhancedCardHeader 
                title={
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-4 w-4 text-primary" />
                    <span>Requirements</span>
                  </div>
                }
                className="border-b border-border/10 bg-background/50 py-3"
              />
              <EnhancedCardContent>
                <p className="text-xs leading-relaxed">{carte.hajyat || 'No requirements specified'}</p>
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard gradient className="h-full">
              <EnhancedCardHeader 
                title={
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span>Method</span>
                  </div>
                }
                className="border-b border-border/10 bg-background/50 py-3"
              />
              <EnhancedCardContent>
                <p className="text-xs leading-relaxed">{carte.tari9a || 'No method specified'}</p>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-primary/90 hover:bg-primary text-primary-foreground"
              size="sm"
            >
              {t('carteTechnique.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarteTechniqueDetailsModal;
