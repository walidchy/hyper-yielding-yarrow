
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AccountPendingModalProps {
  open: boolean;
  onClose: () => void;
}

const AccountPendingModal: React.FC<AccountPendingModalProps> = ({ open, onClose }) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="animate-fade-in max-w-sm text-center">
        <DialogHeader>
          <div className="flex flex-col items-center gap-2">
            <XCircle className="text-ogec-primary animate-pulse mb-2 w-12 h-12" />
            <DialogTitle className="text-xl font-bold text-ogec-primary">
              {t('accountPending.title')}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t('accountPending.description')}
            <br />
            <span className="mt-2 block text-xs text-muted-foreground">
              {t('accountPending.error')}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} className="w-full bg-ogec-primary hover:bg-ogec-primary/90" aria-label="Close">
            {t('accountPending.ok')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountPendingModal;
