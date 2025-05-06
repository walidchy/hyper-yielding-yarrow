
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEnfants, createEnfant, updateEnfant, deleteEnfant } from '@/services/api/enfants';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, isValid } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Enfant } from '@/types';
import { Plus, Edit, Trash2, Search, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import EnfantForm from '@/components/enfants/EnfantForm';
import EnfantDetailsModal from '@/components/enfants/EnfantDetailsModal';
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

const enfantsColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Full Name' },
  { key: 'date_naissance', label: 'Date of Birth' },
  { key: 'lieu_naissance', label: 'Birthplace' },
  { key: 'sexe', label: 'Gender' },
  { key: 'niveau_scolaire', label: 'School Level' },
  { key: 'nombre_freres', label: 'Number of Brothers' },
  { key: 'nombre_soeurs', label: 'Number of Sisters' },
  { key: 'rang_familial', label: 'Family Rank' },
  { key: 'nom_pere', label: 'Father\'s Name' },
  { key: 'nom_mere', label: 'Mother\'s Name' },
  { key: 'contact_parent', label: 'Parent Contact' },
  { key: 'profession_parent', label: 'Parent Profession' },
  { key: 'date_examen_medical', label: 'Medical Exam Date' },
  { key: 'resultat_examen', label: 'Medical Exam Result' },
  { key: 'region', label: 'Region' },
  { key: 'participation_count', label: 'Participation Count' },
  { key: 'floss', label: 'Floss' },
  { key: 'interests', label: 'Interests' },
  { key: 'hobbies', label: 'Hobbies' }
];

const Enfants = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEnfant, setEditingEnfant] = useState<Enfant | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEnfant, setSelectedEnfant] = useState<Enfant | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['enfants'],
    queryFn: getEnfants,
  });

  const enfants: Enfant[] = data || [];

  console.log("Enfants data received:", enfants);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return t('children.notAvailable');
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'PP') : t('children.invalidDate');
  };

  const createEnfantMutation = useMutation({
    mutationFn: createEnfant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enfants'] });
      toast.success(t('children.createSuccessDesc'));
      setIsFormOpen(false);
    },
    onError: () => {
      toast.error(t('children.createError'));
    },
  });

  const updateEnfantMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Enfant> }) =>
      updateEnfant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enfants'] });
      toast.success(t('children.updateSuccessDesc'));
      setIsFormOpen(false);
      setEditingEnfant(null);
    },
    onError: () => {
      toast.error(t('children.updateError'));
    },
  });

  const deleteEnfantMutation = useMutation({
    mutationFn: deleteEnfant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enfants'] });
      toast.success(t('children.deleteSuccessDesc'));
    },
    onError: () => {
      toast.error(t('children.deleteError'));
    },
  });

  const handleCreateEnfant = (data: Partial<Enfant>) => {
    createEnfantMutation.mutate(data);
  };

  const handleUpdateEnfant = (data: Partial<Enfant>) => {
    if (editingEnfant && editingEnfant.id) {
      updateEnfantMutation.mutate({ id: editingEnfant.id, data });
    }
  };

  const handleDeleteEnfant = (id: number) => {
    if (window.confirm(t('children.confirmDelete'))) {
      deleteEnfantMutation.mutate(id);
    }
  };

  const handleEditClick = (enfant: Enfant) => {
    setEditingEnfant(enfant);
    setIsFormOpen(true);
  };

  const filteredEnfants = Array.isArray(enfants)
    ? enfants.filter(enfant => {
      const matchesSearch =
        (enfant.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (enfant.niveau_scolaire?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (enfant.region?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesGender = genderFilter === '' || enfant.sexe === genderFilter;
      const matchesRegion = regionFilter === '' || enfant.region === regionFilter;

      return matchesSearch && matchesGender && matchesRegion;
    })
    : [];

  const regions = Array.isArray(enfants)
    ? Array.from(new Set(enfants.filter(enfant => enfant.region).map(enfant => enfant.region)))
    : [];

  const totalPages = Math.ceil(filteredEnfants.length / ITEMS_PER_PAGE);
  const paginatedEnfants = filteredEnfants.slice(
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

  const exportAllChildrenData = () => {
    // Make sure we have data to export
    if (!enfants || enfants.length === 0) {
      toast.error(t('children.noDataToExport'));
      return;
    }

    // Export the data with localized column headers
    const localizedColumns = enfantsColumns.map(column => ({
      ...column,
      label: t(column.key) || column.label // Try to translate, fallback to original label
    }));

    exportToCSV(enfants, localizedColumns, 'children_full_data.csv');
    toast.success(t('children.exportSuccess'));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">{t('children.loadError')}</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['enfants'] })}>
            {t('children.retry')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold">{t('children.managementTitle')}</h2>
            {user?.role === 'director' && (
              <Button
                variant="outline"
                size="sm"
                onClick={exportAllChildrenData}
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
              >
                <Download className="mr-2 h-4 w-4" /> {t('children.exportAll')}
              </Button>
            )}
          </div>
          <Button onClick={() => { setEditingEnfant(null); setIsFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> {t('children.add')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('children.managementTitle')}</CardTitle>
            <CardDescription>{t('children.managementDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t('children.searchPlaceholder')}
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-[150px]">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="">{t('children.allGenders')}</option>
                  <option value="M">{t('children.male')}</option>
                  <option value="F">{t('children.female')}</option>
                </select>
              </div>
              <div className="w-full sm:w-[200px]">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="">{t('children.allRegions')}</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>

            {isFormOpen && (
              <Card className="mb-6 border-2 border-primary/20 shadow-md">
                <CardHeader className="bg-muted/30">
                  <CardTitle>{editingEnfant ? t('children.editTitle') : t('children.addTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <EnfantForm
                    enfant={editingEnfant}
                    onSubmit={editingEnfant ? handleUpdateEnfant : handleCreateEnfant}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setEditingEnfant(null);
                    }}
                  />
                </CardContent>
              </Card>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('children.fullName')}</TableHead>
                    <TableHead>{t('children.birthDate')}</TableHead>
                    <TableHead>{t('children.schoolLevel')}</TableHead>
                    <TableHead>{t('children.medicalExamDate')}</TableHead>
                    <TableHead>{t('children.region')}</TableHead>
                    <TableHead>{t('children.participations')}</TableHead>
                    <TableHead className="text-right">{t('children.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEnfants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        {t('children.noChildren')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedEnfants.map((enfant) => (
                      <TableRow key={enfant.id}>
                        <TableCell className="font-medium">{enfant.name}</TableCell>
                        <TableCell>{formatDate(enfant.date_naissance)}</TableCell>
                        <TableCell>{enfant.niveau_scolaire}</TableCell>
                        <TableCell>{formatDate(enfant.date_examen_medical)}</TableCell>
                        <TableCell>{enfant.region}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {t('children.campsValue', [String(enfant.participation_count || 0)])}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(enfant)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteEnfant(enfant.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setSelectedEnfant(enfant); setShowDetailsModal(true); }}
                            >
                              <Eye className="h-4 w-4 mr-1" /> {t('children.showDetails')}
                            </Button>
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
              {t('children.showingCount', [
                String(paginatedEnfants.length),
                String(filteredEnfants.length),
              ])}
            </div>
          </CardFooter>
        </Card>
        <EnfantDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          enfant={selectedEnfant}
        />
      </div>
    </DashboardLayout>
  );
};

export default Enfants;
