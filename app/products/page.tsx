'use client';

import { useMemo, useState } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/lib/hooks/api';
import { formatDate } from '@/lib/utils/date';
import { toast } from 'sonner';

type ProductFormState = {
  code: string;
  name: string;
  interestType: string;
  rateNominal: string;
  termMin: string;
  termMax: string;
  amountMin: string;
  amountMax: string;
  fees: string;
  penalties: string;
  description: string;
  status: string;
};

const emptyProductForm: ProductFormState = {
  code: '',
  name: '',
  interestType: 'flat',
  rateNominal: '',
  termMin: '',
  termMax: '',
  amountMin: '',
  amountMax: '',
  fees: '',
  penalties: '',
  description: '',
  status: 'active',
};

export default function ProductsPage() {
  const [microfinancieraId] = useState('mf_demo_001');
  const { data, isLoading } = useProducts(microfinancieraId);
  const products = useMemo(() => (data as any)?.products || [], [data]);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);

  const parseJsonField = (value: string, fieldName: string) => {
    if (!value.trim()) return undefined;
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error(`El campo ${fieldName} debe ser un objeto clave-valor`);
      }
      return parsed;
    } catch (error: any) {
      throw new Error(`Error en ${fieldName}: ${error.message}`);
    }
  };

  const handleOpenNew = () => {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setDialogOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      code: product.code || '',
      name: product.name || '',
      interestType: product.interestType || 'flat',
      rateNominal: product.rateNominal?.toString() || '',
      termMin: product.termMin?.toString() || '',
      termMax: product.termMax?.toString() || '',
      amountMin: product.amountMin?.toString() || '',
      amountMax: product.amountMax?.toString() || '',
      fees: product.fees ? JSON.stringify(product.fees, null, 2) : '',
      penalties: product.penalties ? JSON.stringify(product.penalties, null, 2) : '',
      description: product.description || '',
      status: product.status || 'active',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!productForm.code.trim() || !productForm.name.trim()) {
        toast.error('Código y nombre son obligatorios');
        return;
      }

      const payload = {
        microfinancieraId,
        code: productForm.code.trim(),
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        interestType: productForm.interestType,
        rateNominal: Number(productForm.rateNominal || 0),
        termMin: Number(productForm.termMin || 0),
        termMax: Number(productForm.termMax || 0),
        amountMin: Number(productForm.amountMin || 0),
        amountMax: Number(productForm.amountMax || 0),
        status: productForm.status,
        fees: parseJsonField(productForm.fees, 'comisiones'),
        penalties: parseJsonField(productForm.penalties, 'penalidades'),
      };

      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          microfinancieraId,
          productId: editingProduct.id,
          data: payload,
        });
        toast.success('Producto actualizado');
      } else {
        await createProductMutation.mutateAsync(payload);
        toast.success('Producto creado');
      }

      setDialogOpen(false);
      setEditingProduct(null);
      setProductForm(emptyProductForm);
    } catch (error: any) {
      toast.error(error.message || 'No se pudo guardar el producto');
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProductMutation.mutateAsync({
        microfinancieraId,
        productId: confirmDelete.id,
      });
      toast.success('Producto eliminado');
      setConfirmDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'No se pudo eliminar el producto');
    }
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Productos</h1>
                  <p className="text-gray-600">Catálogo de productos de crédito configurados</p>
                </div>
              </div>
              <Button onClick={handleOpenNew} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo producto
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Listado de productos</CardTitle>
                <CardDescription>Solo visible para administradores</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando productos...
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay productos configurados.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product: any) => (
                      <div
                        key={product.id}
                        className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1 flex-1">
                            <Badge className="bg-blue-600 text-white text-xs font-semibold">
                              {product.code}
                            </Badge>
                            <h3 className="font-bold text-lg text-gray-900 mt-2">
                              {product.name}
                            </h3>
                          </div>
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                            {product.status || 'activo'}
                          </Badge>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 rounded-lg bg-white/50 border border-gray-200">
                              <p className="text-xs text-gray-600 font-medium">Tasa</p>
                              <p className="text-sm font-bold text-gray-900">
                                {product.rateNominal ? `${product.rateNominal}%` : 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500">{product.interestType}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-white/50 border border-gray-200">
                              <p className="text-xs text-gray-600 font-medium">Plazo</p>
                              <p className="text-sm font-bold text-gray-900">
                                {product.termMin && product.termMax
                                  ? `${product.termMin}-${product.termMax}`
                                  : 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500">meses</p>
                            </div>
                          </div>

                          <div className="p-2 rounded-lg bg-white/50 border border-gray-200">
                            <p className="text-xs text-gray-600 font-medium">Monto</p>
                            <p className="text-sm font-bold text-gray-900">
                              {product.amountMin && product.amountMax
                                ? `S/ ${product.amountMin} - S/ ${product.amountMax}`
                                : 'N/A'}
                            </p>
                          </div>

                          {product.description && (
                            <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-gray-200 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => setConfirmDelete(product)}
                            disabled={deleteProductMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
                <DialogDescription>
                  Define las características financieras del producto de crédito.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input
                    value={productForm.code}
                    onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                    placeholder="CRED_IND"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Crédito individual"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tasa nominal (%)</Label>
                  <Input
                    type="number"
                    value={productForm.rateNominal}
                    onChange={(e) => setProductForm({ ...productForm, rateNominal: e.target.value })}
                    placeholder="18"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de interés</Label>
                  <Select
                    value={productForm.interestType}
                    onValueChange={(value) => setProductForm({ ...productForm, interestType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monto mínimo</Label>
                  <Input
                    type="number"
                    value={productForm.amountMin}
                    onChange={(e) => setProductForm({ ...productForm, amountMin: e.target.value })}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monto máximo</Label>
                  <Input
                    type="number"
                    value={productForm.amountMax}
                    onChange={(e) => setProductForm({ ...productForm, amountMax: e.target.value })}
                    placeholder="5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plazo mínimo (meses)</Label>
                  <Input
                    type="number"
                    value={productForm.termMin}
                    onChange={(e) => setProductForm({ ...productForm, termMin: e.target.value })}
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plazo máximo (meses)</Label>
                  <Input
                    type="number"
                    value={productForm.termMax}
                    onChange={(e) => setProductForm({ ...productForm, termMax: e.target.value })}
                    placeholder="24"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Descripción (opcional)</Label>
                  <Textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Notas sobre condiciones del producto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Comisiones (JSON)</Label>
                  <Textarea
                    value={productForm.fees}
                    onChange={(e) => setProductForm({ ...productForm, fees: e.target.value })}
                    placeholder='{"apertura": 10, "mantenimiento": 5}'
                  />
                </div>
                <div className="space-y-2">
                  <Label>Penalidades (JSON)</Label>
                  <Textarea
                    value={productForm.penalties}
                    onChange={(e) => setProductForm({ ...productForm, penalties: e.target.value })}
                    placeholder='{"moraDiaria": 0.05}'
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={productForm.status}
                    onValueChange={(value) => setProductForm({ ...productForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                >
                  {(createProductMutation.isPending || updateProductMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eliminar producto</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Confirma que deseas eliminar el producto{' '}
                  <strong>{confirmDelete?.name}</strong>.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleteProductMutation.isPending}>
                  {deleteProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
