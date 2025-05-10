
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMembers, createUser, updateUser, deleteUser } from '@/services/api/users';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Member, UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import MemberForm from '@/components/members/MemberForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import MemberDetailsModal from '@/components/members/MemberDetailsModal';
import { exportToCSV } from '@/utils/exportCsv';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ITEMS_PER_PAGE = 10;

const Members = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all'); // Changed from empty string to 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });

  const createMemberMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(t('members.createSuccess', ['Member created successfully']));
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error('Error creating member:', error);
      toast.error(t('members.createError', ['Failed to create member']));
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Member> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(t('members.updateSuccess', ['Member updated successfully']));
      setIsFormOpen(false);
      setEditingMember(null);
    },
    onError: (error) => {
      console.error('Error updating member:', error);
      toast.error(t('members.updateError', ['Failed to update member']));
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(t('members.deleteSuccess', ['Member deleted successfully']));
    },
    onError: (error) => {
      console.error('Error deleting member:', error);
      toast.error(t('members.deleteError', ['Failed to delete member']));
    },
  });

  const handleCreateMember = (data: Partial<Member>) => {
    createMemberMutation.mutate(data);
  };

  const handleUpdateMember = (data: Partial<Member>) => {
    if (editingMember && editingMember.id) {
      updateMemberMutation.mutate({ id: editingMember.id, data });
    }
  };

  const handleDeleteMember = (id: number) => {
    if (window.confirm(t('members.confirmDelete', ['Are you sure you want to delete this member?']))) {
      deleteMemberMutation.mutate(id);
    }
  };

  const handleShowDetails = (member: Member) => {
    setSelectedMember(member);
    setShowDetailsModal(true);
  };

  const roles: UserRole[] = [
    'director',
    'educateur',
    'chef_groupe',
    'infirmier',
    'animateur_general',
    'economat',
    'postman',
    'normal'
  ];

  const searchedMembers = (members || []).filter(
    (member) => {
      const matchesSearch = (
        (member.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (member.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
      const matchesRole = selectedRole === 'all' || member.role === selectedRole;
      return matchesSearch && matchesRole;
    }
  );

  const totalPages = Math.ceil(searchedMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = searchedMembers.slice(
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

  const membersColumns = [
    { key: 'photo', label: t('members.table.photo', ['Photo']) },
    { key: 'id', label: t('members.table.id', ['ID']) },
    { key: 'name', label: t('members.table.name', ['Name']) },
    { key: 'email', label: t('members.table.email', ['Email']) },
    { key: 'role', label: t('members.table.role', ['Role']) },
  ];

  // Function to get initials from name for avatar fallback
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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

  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold">{t('members.title', ['Members'])}</h2>
              {user?.role === 'director' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(members, membersColumns, 'members.csv')}
                >
                  {t('general.exportCSV', ['Export CSV'])}
                </Button>
              )}
            </div>
            <Button onClick={() => { setEditingMember(null); setIsFormOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> {t('members.add', ['Add Member'])}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('members.manage', ['Member Management'])}</CardTitle>
              <CardDescription>{t('members.manageDescription', ['Manage all your members here'])}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('members.searchPlaceholder', ['Search members...'])}
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-[200px]">
                  <Select
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('members.filterByRole', ['Filter by role'])} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t('members.allRoles', ['All roles'])}
                      </SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {t(`members.roles.${role}`, [role])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isFormOpen && (
                <Card className="mb-6 border-2 border-primary/20 shadow-md">
                  <CardHeader className="bg-muted/30">
                    <CardTitle>{editingMember ? t('members.edit', ['Edit Member']) : t('members.addNew', ['Add New Member'])}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <MemberForm
                      member={editingMember}
                      onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
                      onCancel={() => {
                        setIsFormOpen(false);
                        setEditingMember(null);
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('members.table.photo', ['Photo'])}</TableHead>
                      <TableHead>{t('members.table.name', ['Name'])}</TableHead>
                      <TableHead>{t('members.table.email', ['Email'])}</TableHead>
                      <TableHead>{t('members.table.role', ['Role'])}</TableHead>
                      <TableHead className="text-right">{t('members.table.actions', ['Actions'])}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          {t('members.noMembers', ['No members found. Try changing your search criteria or add a new member.'])}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <Avatar className="w-10 h-10">
                              <AvatarImage 
                                src={member.profile_picture} 
                                alt={member.name} 
                              />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingMember(member);
                                  setIsFormOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteMember(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              {user?.role === "director" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleShowDetails(member)}
                                >
                                  <Eye className="h-4 w-4" />
                                  Show
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
                {t('members.showingCount', [
                  String(paginatedMembers.length),
                  String(searchedMembers.length)
                ]) || `Showing ${paginatedMembers.length} of ${searchedMembers.length} members`}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <MemberDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        member={selectedMember}
      />
    </DashboardLayout>
  );
};

export default Members;
