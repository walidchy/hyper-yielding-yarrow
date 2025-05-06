import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPhases, createPhase, updatePhase, deletePhase } from '@/services/api/phases';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phase } from '@/types';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import PhaseForm from '@/components/phases/PhaseForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 6;

const Phases = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);

  const { data: phases = [], isLoading } = useQuery({
    queryKey: ['phases'],
    queryFn: getPhases,
  });

  const createPhaseMutation = useMutation({
    mutationFn: createPhase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
      toast.success(t('phases.createSuccess', ['Phase created successfully']));
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error('Error creating phase:', error);
      toast.error(t('phases.createError', ['Failed to create phase']));
    },
  });

  const updatePhaseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Phase> }) =>
      updatePhase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
      toast.success(t('phases.updateSuccess', ['Phase updated successfully']));
      setIsFormOpen(false);
      setEditingPhase(null);
    },
    onError: (error) => {
      console.error('Error updating phase:', error);
      toast.error(t('phases.updateError', ['Failed to update phase']));
    },
  });

  const deletePhaseMutation = useMutation({
    mutationFn: deletePhase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
      toast.success(t('phases.deleteSuccess', ['Phase deleted successfully']));
    },
    onError: (error) => {
      console.error('Error deleting phase:', error);
      toast.error(t('phases.deleteError', ['Failed to delete phase']));
    },
  });

  const handleCreatePhase = (data: Partial<Phase>) => {
    createPhaseMutation.mutate(data);
  };

  const handleUpdatePhase = (data: Partial<Phase>) => {
    if (editingPhase && editingPhase.id) {
      updatePhaseMutation.mutate({ id: editingPhase.id, data });
    }
  };

  const handleDeletePhase = (id: number) => {
    if (window.confirm(t('phases.confirmDelete', ['Are you sure you want to delete this phase?']))) {
      deletePhaseMutation.mutate(id);
    }
  };

  const filteredPhases = phases.filter(phase => {
    const matchesSearch = phase.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       phase.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       phase.year.toString().includes(searchTerm);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredPhases.length / ITEMS_PER_PAGE);
  const paginatedPhases = filteredPhases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(p => p + 1);
    }
  };

  const handleFormSubmit = (data: Partial<Phase>) => {
    if (editingPhase) {
      handleUpdatePhase(data);
    } else {
      handleCreatePhase(data);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold">{t('phases.title', ['Phases'])}</h2>
          </div>
          <Button 
            onClick={() => { setEditingPhase(null); setIsFormOpen(true); }}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> {t('phases.add', ['Add Phase'])}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('phases.search', ['Search phases...'])}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPhases.map((phase) => (
            <EnhancedCard
              key={phase.id}
              className="transform transition-all duration-200 hover:-translate-y-1"
              gradient
            >
              <EnhancedCardHeader
                title={phase.name}
                className="border-b border-border/10"
              />
              <EnhancedCardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Year:</span> {phase.year}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Start:</span>{' '}
                    {format(new Date(phase.start_date), 'PP')}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">End:</span>{' '}
                    {format(new Date(phase.end_date), 'PP')}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary/10"
                      onClick={() => {
                        setEditingPhase(phase);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover:bg-destructive/90"
                      onClick={() => handleDeletePhase(phase.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePrevious}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNext}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPhase ? t('phases.edit', ['Edit Phase']) : t('phases.add', ['Add Phase'])}
              </DialogTitle>
            </DialogHeader>
            <PhaseForm
              phase={editingPhase}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Phases;
