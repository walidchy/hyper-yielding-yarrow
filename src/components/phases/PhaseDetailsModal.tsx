
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phase } from "@/types";
import { Calendar, Clock, Info } from "lucide-react";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from "@/components/ui/enhanced-card";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase: Phase | null;
}

const PhaseDetailsModal: React.FC<Props> = ({ open, onOpenChange, phase }) => {
  if (!phase) return null;

  const detailItems = [
    { icon: Info, label: "Name", value: phase.name },
    { icon: Info, label: "Year", value: phase.year },
    { icon: Calendar, label: "Start Date", value: format(new Date(phase.start_date), "PPP") },
    { icon: Calendar, label: "End Date", value: format(new Date(phase.end_date), "PPP") },
    { icon: Info, label: "Status", value: phase.status },
    { icon: Clock, label: "Created", value: format(new Date(phase.created_at), "PPP 'at' p") },
    { icon: Clock, label: "Updated", value: format(new Date(phase.updated_at), "PPP 'at' p") }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Phase Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <EnhancedCard gradient>
            <EnhancedCardHeader 
              title={`Phase #${phase.id}`}
              className="border-b border-border/10 bg-background/50 py-3"
            />
            <EnhancedCardContent>
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

          {phase.description && (
            <EnhancedCard gradient>
              <EnhancedCardHeader 
                title="Description"
                className="border-b border-border/10 bg-background/50 py-3"
              />
              <EnhancedCardContent>
                <p className="text-sm leading-relaxed">{phase.description}</p>
              </EnhancedCardContent>
            </EnhancedCard>
          )}

          <div className="flex justify-end pt-2">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-primary/90 hover:bg-primary text-primary-foreground"
              size="sm"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhaseDetailsModal;
