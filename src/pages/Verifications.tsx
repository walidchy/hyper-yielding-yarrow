import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getInactiveUsers, activateUser, deleteUser } from "@/services/api/verifications";
import DashboardLayout from "@/components/DashboardLayout";
import { User } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

const Verifications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["inactive-users"],
    queryFn: getInactiveUsers,
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => activateUser(id),
    onSuccess: () => {
      toast({ title: t('verifications.userActivated'), description: t('verifications.userAccepted') });
      queryClient.invalidateQueries({ queryKey: ["inactive-users"] });
    },
    onError: () => {
      toast({ title: t('verifications.error'), description: t('verifications.activationError'), variant: "destructive" });
    },
  });

  const refuseMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast({ title: t('verifications.userRefused'), description: t('verifications.userDeleted') });
      queryClient.invalidateQueries({ queryKey: ["inactive-users"] });
    },
    onError: () => {
      toast({ title: t('verifications.error'), description: t('verifications.deleteError'), variant: "destructive" });
    },
  });

  const filteredUsers = users.filter((user: User) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8">
        <h2 className="text-3xl font-extrabold mb-6 text-ogec-primary tracking-tight">{t('verifications.title')}</h2>
        <Card className="shadow-card border-ogec-border glass-morphism">
          <CardHeader>
            <CardTitle className="text-lg text-ogec-primary">{t('verifications.pendingRegistrations')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('verifications.searchUsers')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-8 text-center">{t('verifications.loading')}</div>
            ) : paginatedUsers.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('verifications.name')}</TableHead>
                      <TableHead>{t('verifications.email')}</TableHead>
                      <TableHead>{t('verifications.role')}</TableHead>
                      <TableHead>{t('verifications.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user: User) => (
                      <TableRow key={user.id} className="border-b transition hover:bg-softblue/70">
                        <td className="p-3 font-semibold">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 capitalize">{user.role}</td>
                        <td className="p-3 space-x-2 flex flex-wrap">
                          <Button
                            variant="outline"
                            className="bg-green-50 hover:bg-green-200 text-green-700 border-green-100"
                            onClick={() => activateMutation.mutate(user.id)}
                            disabled={activateMutation.isPending}
                          >
                            {t('verifications.accept')}
                          </Button>
                          <Button
                            variant="destructive"
                            className="bg-red-50 hover:bg-red-200 text-red-700 border-red-100"
                            onClick={() => refuseMutation.mutate(user.id)}
                            disabled={refuseMutation.isPending}
                          >
                            {t('verifications.refuse')}
                          </Button>
                        </td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
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
                            onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {t('verifications.noUsers')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Verifications;
