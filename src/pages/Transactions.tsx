
import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Wallet, Edit, Trash2, Plus, Search } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Team, Transaction, Enfant } from "@/types";

const ITEMS_PER_PAGE = 10;

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    enfant_id: "",
    item_description: "",
    item_cost: "",
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChildId, setSelectedChildId] = useState<string>("all");
  const [teamChildren, setTeamChildren] = useState<Enfant[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [dialogEnfants, setDialogEnfants] = useState<Enfant[]>([]);
  const [loadingEnfants, setLoadingEnfants] = useState(false);

  const { user } = useAuth();
  const { t, direction } = useLanguage();

  useEffect(() => {
    const fetchTeamChildren = async () => {
      setLoadingChildren(true);
      try {
        const response = await api.get('/teams');
        const teams: Team[] = response.data.data || [];
        
        const uniqueChildren = teams
          .filter(team => 
            team.educateur_id === user?.id || 
            team.chef_id === user?.id
          )
          .flatMap(team => team.enfants || [])
          .filter((child, index, self) => 
            index === self.findIndex(c => c.id === child.id)
          );
        
        setTeamChildren(uniqueChildren);
      } catch (error) {
        console.error('Error fetching team children:', error);
        toast({
          variant: "destructive",
          title: t("error.somethingWentWrong"),
        });
      } finally {
        setLoadingChildren(false);
      }
    };

    if (user?.id) {
      fetchTeamChildren();
    }
  }, [user?.id, t]);

  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [fetchingEnfants, setFetchingEnfants] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFetchingEnfants(true);
    api
      .get("/enfants")
      .then((res) => {
        const enfantsData = res.data?.data || res.data || [];
        setEnfants(Array.isArray(enfantsData) ? enfantsData : []);
      })
      .catch((err) => {
        setError(t("error.somethingWentWrong"));
        toast({
          variant: "destructive",
          title: t("error.somethingWentWrong"),
        });
      })
      .finally(() => setFetchingEnfants(false));
  }, [t]);

  useEffect(() => {
    const fetchDialogEnfants = async () => {
      setLoadingEnfants(true);
      try {
        const response = await api.get('/enfants');
        console.log("Children response:", response.data);
        
        let enfantsData: Enfant[] = [];
        
        if (response.data && response.data.success && response.data.data) {
          if (response.data.data.data && Array.isArray(response.data.data.data)) {
            console.log("Using paginated data format");
            enfantsData = response.data.data.data;
          } 
          else if (Array.isArray(response.data.data)) {
            console.log("Using array in data format");
            enfantsData = response.data.data;
          }
        } 
        else if (Array.isArray(response.data)) {
          console.log("Using direct array format");
          enfantsData = response.data;
        }
        
        console.log("Processed children data:", enfantsData);
        setDialogEnfants(Array.isArray(enfantsData) ? enfantsData : []);
      } catch (error) {
        console.error('Error fetching enfants:', error);
        toast({
          variant: "destructive",
          title: t("transactions.form.noChildrenFound"),
        });
      } finally {
        setLoadingEnfants(false);
      }
    };

    if (showDialog) {
      fetchDialogEnfants();
    }
  }, [showDialog, t]);

  const fetchTransactions = () => {
    setLoading(true);
    setError(null);
    api
      .get("/transactions")
      .then((res) => {
        let transactionsData: Transaction[] = [];
        if (Array.isArray(res.data)) {
          transactionsData = res.data;
        } else if (res.data && typeof res.data === 'object') {
          if (Array.isArray(res.data.data)) {
            transactionsData = res.data.data;
          } else if (res.data.transactions && Array.isArray(res.data.transactions)) {
            transactionsData = res.data.transactions;
          } else if (res.data.id && typeof res.data.id === 'number') {
            transactionsData = [res.data];
          }
        }
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        setError(null);
      })
      .catch((error) => {
        setError(t("transactions.loading"));
        toast({ variant: "destructive", title: t("error.somethingWentWrong") });
        setTransactions([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, [t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const openDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditId(transaction.id);
      setForm({
        enfant_id: String(transaction.enfant_id),
        item_description: transaction.item_description,
        item_cost: String(transaction.item_cost),
      });
    } else {
      setEditId(null);
      setForm({ enfant_id: "", item_description: "", item_cost: "" });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.enfant_id || !form.item_description || !form.item_cost) {
      toast({ variant: "destructive", title: t("validation.required") });
      return;
    }
    try {
      if (editId) {
        await api.put(`/transactions/${editId}`, {
          enfant_id: Number(form.enfant_id),
          item_description: form.item_description,
          item_cost: Number(form.item_cost),
        });
        toast({ variant: "default", title: t("general.success") });
      } else {
        await api.post("/transactions", {
          enfant_id: Number(form.enfant_id),
          item_description: form.item_description,
          item_cost: Number(form.item_cost),
        });
        toast({ variant: "default", title: t("general.success") });
      }
      setShowDialog(false);
      fetchTransactions();
    } catch (error) {
      toast({ variant: "destructive", title: t("error.somethingWentWrong") });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("transactions.confirmDelete"))) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast({ variant: "default", title: t("general.success") });
      fetchTransactions();
    } catch (error) {
      toast({ variant: "destructive", title: t("error.somethingWentWrong") });
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.item_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(tx.item_cost).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChild = selectedChildId === "all" || 
      tx.enfant_id === parseInt(selectedChildId);

    return matchesSearch && matchesChild;
  });

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevious = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };

  const renderTransactions = () => {
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center text-red-500 py-10">{error}</TableCell>
        </TableRow>
      );
    }
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-10">
            <LoadingSpinner size="md" text={t("transactions.loading")} />
          </TableCell>
        </TableRow>
      );
    }
    if (!paginatedTransactions || paginatedTransactions.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-10">{t("transactions.noTransactions")}</TableCell>
        </TableRow>
      );
    }
    return paginatedTransactions.map((tx) => (
      <TableRow key={tx.id} className="hover:bg-soft-purple/40 transition">
        <TableCell className="font-medium">
          {tx.enfant?.name || enfants.find(e => e.id === tx.enfant_id)?.name || "—"}
        </TableCell>
        <TableCell className="">{tx.item_description}</TableCell>
        <TableCell>
          <span className="font-semibold text-accent">{tx.item_cost} <span className="text-xs text-gray-400">MAD</span></span>
        </TableCell>
        <TableCell className="whitespace-nowrap">{new Date(tx.created_at).toLocaleDateString()}</TableCell>
        <TableCell className="text-right space-x-2">
          <Button size="icon" variant="ghost" onClick={() => openDialog(tx)} aria-label={t("transactions.edit")}>
            <Edit size={16} />
          </Button>
          <Button size="icon" variant="ghost" className="text-red-600" onClick={() => handleDelete(tx.id)} aria-label={t("general.delete")}>
            <Trash2 size={16} />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary/90 drop-shadow">
                  <Wallet className="text-primary" /> {t("transactions.title")}
                </CardTitle>
                <Button onClick={() => openDialog()} variant="default" className="flex items-center gap-2 shadow hover:bg-primary/90 hover:scale-105 transition-transform">
                  <Plus className="mr-1" size={18} /> {t("transactions.add")}
                </Button>
              </div>
              <CardDescription className="text-muted-foreground">
                {t("transactions.manage")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className={`absolute ${direction === 'rtl' ? 'right-2.5' : 'left-2.5'} top-2.5 h-4 w-4 text-muted-foreground`} />
                    <Input
                      type="search"
                      placeholder={t("transactions.searchPlaceholder")}
                      className={direction === 'rtl' ? 'pr-9' : 'pl-9'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select
                  value={selectedChildId}
                  onValueChange={setSelectedChildId}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t("transactions.filterByChild")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("transactions.allChildren")}</SelectItem>
                    {teamChildren.map((child) => (
                      <SelectItem key={child.id} value={String(child.id)}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-36">{t("transactions.childName")}</TableHead>
                      <TableHead>{t("transactions.description")}</TableHead>
                      <TableHead>{t("transactions.amount")}</TableHead>
                      <TableHead>{t("transactions.date")}</TableHead>
                      <TableHead className="text-right">{t("transactions.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderTransactions()}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <nav className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
                      {"<"}
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
                      {">"}
                    </Button>
                  </nav>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {t("transactions.showingCount", [
                  String(paginatedTransactions.length),
                  String(filteredTransactions.length)
                ])}
              </div>
            </CardFooter>
          </Card>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-lg rounded-2xl bg-white dark:bg-darkpurple/95 shadow-2xl p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-xl font-semibold text-primary">
                {editId ? t("transactions.editTransaction") : t("transactions.addNew")}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editId
                  ? t("transactions.form.editDescription")
                  : t("transactions.form.description")
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-4">
              <div>
                <label className="block text-sm text-primary font-medium mb-1">{t("transactions.childName")} <span className="text-red-500">*</span></label>
                <Select
                  value={form.enfant_id}
                  onValueChange={(value) => setForm(prev => ({ ...prev, enfant_id: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("transactions.form.selectChild")} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingEnfants ? (
                      <SelectItem value="loading" disabled>{t("transactions.form.loadingChildren")}</SelectItem>
                    ) : dialogEnfants.length > 0 ? (
                      dialogEnfants.map((enfant) => (
                        <SelectItem key={enfant.id} value={String(enfant.id)}>
                          {enfant.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>{t("transactions.form.noChildrenFound")}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-primary font-medium mb-1">{t("transactions.description")} <span className="text-red-500">*</span></label>
                <Input
                  name="item_description"
                  placeholder={t("transactions.form.descriptionPlaceholder")}
                  value={form.item_description}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-primary font-medium mb-1">{t("transactions.form.amountLabel")} <span className="text-red-500">*</span></label>
                <Input
                  name="item_cost"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder={t("transactions.form.amountPlaceholder")}
                  value={form.item_cost}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg"
                />
              </div>
              <DialogFooter className="pt-2 flex gap-3">
                <Button type="submit" className="flex-1 shadow-lg">
                  {editId ? t("transactions.edit") : t("transactions.add")}
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary" type="button" className="flex-1 bg-muted/80">
                    {t("general.cancel")}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
