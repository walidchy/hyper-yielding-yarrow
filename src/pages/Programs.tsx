import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPrograms, createProgram, updateProgram, deleteProgram, getPhases } from '@/services/api/programs';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Program } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search, Filter, Eye } from 'lucide-react';
import { toast } from 'sonner';
import ProgramForm from '@/components/programs/ProgramForm';
import ProgramDetailsModal from '@/components/programs/ProgramDetailsModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from '@/contexts/AuthContext';
import { exportToCSV } from '@/utils/exportCsv';
import { useLanguage } from '@/contexts/LanguageContext';

const ITEMS_PER_PAGE = 10;

const programsColumns = [
  { key: 'id', label: 'ID' },
  { key: 'jour', label: 'Date' },
  { key: 'horaire', label: 'Time' },
  { key: 'activite', label: 'Activity' },
  { key: 'type_activite', label: 'Type' },
  { key: 'phase_name', label: 'Phase' }
];

const Programs = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t, direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const canModifyPrograms = () => {
    return user?.role === 'director';
  };

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms,
  });

  const { data: phases = [] } = useQuery({
    queryKey: ['phases'],
    queryFn: getPhases,
  });

  const createProgramMutation = useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success(t('programs.createSuccess'));
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error('Error creating program:', error);
      toast.error(t('programs.createError'));
    },
  });

  const updateProgramMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Program> }) => 
      updateProgram(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success(t('programs.updateSuccess'));
      setIsFormOpen(false);
      setEditingProgram(null);
    },
    onError: (error) => {
      console.error('Error updating program:', error);
      toast.error(t('programs.updateError'));
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success(t('programs.deleteSuccess'));
    },
    onError: (error) => {
      console.error('Error deleting program:', error);
      toast.error(t('programs.deleteError'));
    },
  });

  const handleCreateProgram = (data: Partial<Program>) => {
    createProgramMutation.mutate(data);
  };

  const handleUpdateProgram = (data: Partial<Program>) => {
    if (editingProgram && editingProgram.id) {
      updateProgramMutation.mutate({ id: editingProgram.id, data });
    }
  };

  const handleDeleteProgram = (id: number) => {
    if (window.confirm(t('programs.confirmDelete'))) {
      deleteProgramMutation.mutate(id);
    }
  };

  const handleEditClick = (program: Program) => {
    setEditingProgram(program);
    setIsFormOpen(true);
  };

  const handleExportCSV = () => {
    const exportData = filteredPrograms.map(program => ({
      id: program.id,
      jour: program.jour ? format(new Date(program.jour), 'PP') : 'N/A',
      horaire: program.horaire || 'N/A',
      activite: program.activite || program.title || 'N/A',
      type_activite: (program.type_activite || 'N/A').replace('_', ' '),
      phase_name: program.phase?.name || 'Unknown Phase'
    }));
    
    exportToCSV(exportData, programsColumns, 'programs-export.csv');
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.activite?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.type_activite?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (program.phase?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activityFilter === 'general') {
      return matchesSearch && ['soiree', 'apres_midi', 'matin'].includes(program.type_activite || '');
    }
    
    if (activityFilter === 'pedagogique') {
      return matchesSearch && program.type_activite === 'pedagogique';
    }
    
    return matchesSearch && (activityFilter === '' || program.type_activite === activityFilter);
  });

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold">{t('programs.title')}</h2>
          <div className="flex gap-2">
            {user?.role === 'director' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV}
              >
                {t('programs.exportCSV')}
              </Button>
            )}
            {canModifyPrograms() && (
              <Button onClick={() => { setEditingProgram(null); setIsFormOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" /> {t('programs.add')}
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('programs.manage')}</CardTitle>
            <CardDescription>{t('programs.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute ${direction === 'rtl' ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-muted-foreground`} />
                  <Input
                    type="search"
                    placeholder={t('programs.search')}
                    className={direction === 'rtl' ? 'pr-9' : 'pl-9'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-[200px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                  >
                    <option value="">{t('programs.allTypes')}</option>
                    <option value="general">{t('programs.general')}</option>
                    <option value="pedagogique">{t('programs.pedagogique')}</option>
                  </select>
                </div>
              </div>
            </div>

            {isFormOpen && (
              <Card className="mb-6 border-2 border-primary/20 shadow-md">
                <CardHeader className="bg-muted/30">
                  <CardTitle>{editingProgram ? t('programs.edit') : t('programs.addNew')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ProgramForm 
                    program={editingProgram}
                    phases={phases} 
                    onSubmit={editingProgram ? handleUpdateProgram : handleCreateProgram}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setEditingProgram(null);
                    }}
                  />
                </CardContent>
              </Card>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('programs.date')}</TableHead>
                    <TableHead>{t('programs.time')}</TableHead>
                    <TableHead>{t('programs.activity')}</TableHead>
                    <TableHead>{t('programs.type')}</TableHead>
                    <TableHead>{t('programs.phase')}</TableHead>
                    <TableHead className={`text-${direction === 'rtl' ? 'left' : 'right'}`}>{t('programs.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPrograms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        {t('programs.noPrograms')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPrograms.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell>{format(new Date(program.jour || program.start_date), 'PP')}</TableCell>
                        <TableCell>{program.horaire || 'N/A'}</TableCell>
                        <TableCell>{program.activite || program.title || 'N/A'}</TableCell>
                        <TableCell className="capitalize">{(program.type_activite || 'N/A').replace('_', ' ')}</TableCell>
                        <TableCell>{program.phase?.name || 'Unknown Phase'}</TableCell>
                        <TableCell className={`text-${direction === 'rtl' ? 'left' : 'right'}`}>
                          <div className={`flex justify-${direction === 'rtl' ? 'start' : 'end'} gap-2`}>
                            {canModifyPrograms() && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditClick(program)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteProgram(program.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {user?.role === "director" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedProgram(program);
                                  setShowDetailsModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" /> Show
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {t('programs.showing', [paginatedPrograms.length.toString(), filteredPrograms.length.toString()])}
            </div>
          </CardFooter>
        </Card>
        <ProgramDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          program={selectedProgram}
        />
      </div>
    </DashboardLayout>
  );
};

export default Programs;
