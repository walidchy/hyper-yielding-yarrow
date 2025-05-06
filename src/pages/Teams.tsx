import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeams, createTeam, updateTeam, deleteTeam, removeEnfantFromTeam } from '@/services/api/teams';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Team } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import TeamForm from '@/components/teams/TeamForm';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAuth } from '@/contexts/AuthContext';
import { exportToCSV } from '@/utils/exportCsv';
import { useLanguage } from '@/contexts/LanguageContext';
import TeamDetailsModal from '@/components/teams/TeamDetailsModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const ITEMS_PER_PAGE = 10;

const Teams = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const teamsColumns = [
    { key: 'id', label: t('teams.table.id', ['ID']) },
    { key: 'educateur', label: t('teams.table.educateur', ['Educator']) },
    { key: 'chef', label: t('teams.table.chef', ['Team Leader']) },
    { key: 'phase', label: t('teams.table.phase', ['Phase']) },
  ];

  const { data: teams = [], isLoading, isError, error } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
    retry: 3,
    meta: {
      onError: (err) => {
        console.error('Error fetching teams in React Query:', err);
        toast.error(t('teams.loadError', ['Failed to load teams']));
      }
    }
  });

  React.useEffect(() => {
    console.log('Teams data from query:', teams);
  }, [teams]);

  const createTeamMutation = useMutation({
    mutationFn: (data: {
      educateur_id: number;
      enfant_id: number[];
      phase_id: number;
      chef_id: number;
    }) => createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success(t('teams.createSuccess', ['Team created successfully']));
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error('Error creating team:', error);
      toast.error(t('teams.createError', ['Failed to create team']));
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }: { 
      id: number; 
      data: {
        educateur_id?: number;
        phase_id?: number;
        chef_id?: number;
      }
    }) => updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success(t('teams.updateSuccess', ['Team updated successfully']));
      setIsFormOpen(false);
      setEditingTeam(null);
    },
    onError: (error) => {
      console.error('Error updating team:', error);
      toast.error(t('teams.updateError', ['Failed to update team']));
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success(t('teams.deleteSuccess', ['Team deleted successfully']));
    },
    onError: (error) => {
      console.error('Error deleting team:', error);
      toast.error(t('teams.deleteError', ['Failed to delete team']));
    },
  });

  const removeEnfantMutation = useMutation({
    mutationFn: ({ teamId, enfantId }: { teamId: number; enfantId: number }) =>
      removeEnfantFromTeam(teamId, enfantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success(t('teams.removeEnfantSuccess', ['Child removed from team successfully']));
    },
    onError: (error) => {
      console.error('Error removing child from team:', error);
      toast.error(t('teams.removeEnfantError', ['Failed to remove child from team']));
    },
  });

  const handleCreateTeam = (data: {
    educateur_id: number;
    enfant_id: number[];
    phase_id: number;
    chef_id: number;
  }) => {
    createTeamMutation.mutate(data);
  };

  const handleUpdateTeam = (data: Partial<Team>) => {
    if (editingTeam && editingTeam.id) {
      updateTeamMutation.mutate({ id: editingTeam.id, data });
    }
  };

  const handleDeleteTeam = (id: number) => {
    if (window.confirm(t('teams.confirmDelete', ['Are you sure you want to delete this team?']))) {
      deleteTeamMutation.mutate(id);
    }
  };

  const handleShowDetails = (team: Team) => {
    console.log('Team details:', team);
    setSelectedTeam(team);
    setShowDetailsModal(true);
  };

  const searchedTeams = teams && teams.length ? teams.filter(
    (team) => (
      (team.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (team.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (team.educateur?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (team.chef?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (team.phase?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )
  ) : [];

  const totalPages = Math.ceil(searchedTeams.length / ITEMS_PER_PAGE);
  const paginatedTeams = searchedTeams.slice(
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text={t('teams.loading', ['Loading teams...'])} />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    console.log('Error object:', error);
    return (
      <DashboardLayout>
        <div className="flex-1 p-6">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">{t('teams.errorTitle', ['Error Loading Teams'])}</CardTitle>
              <CardDescription>
                {t('teams.errorDescription', ['There was an error loading the teams data. Please try again later.'])}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                {error instanceof Error ? error.message : String(error)}
              </pre>
              <Button 
                className="mt-4"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['teams'] })}
              >
                {t('teams.retry', ['Try Again'])}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const isDirector = user?.role === 'director';

  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold">{t('teams.title', ['Teams'])}</h2>
              {isDirector && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(teams, teamsColumns, 'teams.csv')}
                >
                  {t('general.exportCSV', ['Export CSV'])}
                </Button>
              )}
            </div>
            {isDirector && (
              <Button onClick={() => { setEditingTeam(null); setIsFormOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" /> {t('teams.add', ['Add Team'])}
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('teams.management', ['Team Management'])}</CardTitle>
              <CardDescription>{t('teams.manageDescription', ['Manage all your teams here'])}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('teams.searchPlaceholder', ['Search teams...'])}
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {isFormOpen && (
                <Card className="mb-6 border-2 border-primary/20 shadow-md">
                  <CardHeader className="bg-muted/30">
                    <CardTitle>{editingTeam ? t('teams.edit', ['Edit Team']) : t('teams.addNew', ['Add New Team'])}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <TeamForm
                      team={editingTeam}
                      onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam}
                      onCancel={() => {
                        setIsFormOpen(false);
                        setEditingTeam(null);
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('teams.table.educateur', ['Educator'])}</TableHead>
                      <TableHead>{t('teams.table.chef', ['Team Leader'])}</TableHead>
                      <TableHead>{t('teams.table.phase', ['Phase'])}</TableHead>
                      <TableHead className="text-right">{t('teams.table.actions', ['Actions'])}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTeams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          {teams && teams.length > 0 ? (
                            t('teams.noTeamsMatch', ['No teams match your search criteria.'])
                          ) : (
                            t('teams.noTeams', ['No teams found. Try adding a new team.'])
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTeams.map((team) => (
                        <TableRow key={team.id}>
                          <TableCell>{team.educateur?.name || '-'}</TableCell>
                          <TableCell>{team.chef?.name || '-'}</TableCell>
                          <TableCell>{team.phase?.name || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {isDirector && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingTeam(team);
                                      setIsFormOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteTeam(team.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleShowDetails(team)}
                              >
                                <Eye className="h-4 w-4" />
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
                {t('teams.showingCount', [
                  String(paginatedTeams.length),
                  String(searchedTeams.length)
                ]) || `Showing ${paginatedTeams.length} of ${searchedTeams.length} teams`}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <TeamDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        team={selectedTeam}
      />
    </DashboardLayout>
  );
};

export default Teams;
