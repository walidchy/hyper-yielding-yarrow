
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Team } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { User, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
}

const TeamDetailsModal: React.FC<Props> = ({ open, onOpenChange, team }) => {
  const { t } = useLanguage();
  
  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('teams.management')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team Leadership */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{t('teams.table.teamLeader')}</span>
                    <span>{team.chef?.name || t('profile.notSpecified', [])}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{t('teams.table.educateur')}</span>
                    <span>{team.educateur?.name || t('profile.notSpecified', [])}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase Information */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div><strong>{t('teams.table.phase')}:</strong> {team.phase?.name}</div>
                  {team.phase?.year && <div><strong>{t('phases.form.year', [])}:</strong> {team.phase.year}</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Children Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{t('children.managementTitle', [])}</span>
                </div>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="pl-7 divide-y">
                    {team.enfants && team.enfants.length > 0 ? (
                      team.enfants.map((enfant) => (
                        <div key={enfant.id} className="py-3 space-y-2">
                          <div><strong>{t('children.fullName', [])}:</strong> {enfant.name}</div>
                          {enfant.date_naissance && (
                            <div><strong>{t('children.birthDate', [])}:</strong> {enfant.date_naissance}</div>
                          )}
                          {enfant.sexe && (
                            <div><strong>{t('carteTechnique.gender', [])}:</strong> {enfant.sexe}</div>
                          )}
                          {enfant.contact_parent && (
                            <div><strong>{t('children.contactParent', [])}:</strong> {enfant.contact_parent}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-3 text-muted-foreground">{t('teams.noChildrenAssigned', [])}</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t('general.close', [])}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamDetailsModal;
