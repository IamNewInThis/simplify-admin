import { useState, useEffect } from 'react';
import { manufacturersAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search, RefreshCw, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import ManufacturerForm from '@/components/manufacturers/ManufacturerForm';
import DeleteConfirmDialog from '@/components/manufacturers/DeleteConfirmDialog';

export default function Manufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [deletingManufacturer, setDeletingManufacturer] = useState(null);

  // Load manufacturers with brand count
  const loadManufacturers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await manufacturersAPI.getWithBrands();
      setManufacturers(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar los fabricantes');
      console.error('Error loading manufacturers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManufacturers();
  }, []);

  // Filter manufacturers by search term
  const filteredManufacturers = manufacturers.filter(manufacturer =>
    manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manufacturer.main_business_line?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create manufacturer
  const handleCreate = async (data) => {
    try {
      await manufacturersAPI.create(data);
      setIsCreateDialogOpen(false);
      loadManufacturers();
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Error al crear el fabricante');
    }
  };

  // Handle update manufacturer
  const handleUpdate = async (data) => {
    try {
      await manufacturersAPI.update(editingManufacturer.id, data);
      setEditingManufacturer(null);
      loadManufacturers();
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Error al actualizar el fabricante');
    }
  };

  // Handle delete manufacturer
  const handleDelete = async () => {
    try {
      await manufacturersAPI.delete(deletingManufacturer.id);
      setDeletingManufacturer(null);
      loadManufacturers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al eliminar el fabricante');
      setDeletingManufacturer(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Fabricantes</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los fabricantes de productos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Fabricante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Fabricante</DialogTitle>
              <DialogDescription>
                Crea un nuevo fabricante para asociar marcas.
              </DialogDescription>
            </DialogHeader>
            <ManufacturerForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar fabricantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={loadManufacturers}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Giro de Negocio</TableHead>
              <TableHead>ID Fiscal</TableHead>
              <TableHead>Marcas</TableHead>
              <TableHead>Sitio Web</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Cargando fabricantes...
                </TableCell>
              </TableRow>
            ) : filteredManufacturers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No se encontraron fabricantes' : 'No hay fabricantes creados'}
                </TableCell>
              </TableRow>
            ) : (
              filteredManufacturers.map((manufacturer) => (
                <TableRow key={manufacturer.id}>
                  <TableCell className="font-medium">{manufacturer.name}</TableCell>
                  <TableCell>{manufacturer.country || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {manufacturer.main_business_line || '-'}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {manufacturer.tax_id || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{manufacturer.brand_count}</Badge>
                  </TableCell>
                  <TableCell>
                    {manufacturer.website ? (
                      <a 
                        href={manufacturer.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="text-sm">Visitar</span>
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingManufacturer(manufacturer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingManufacturer(manufacturer)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Total: {filteredManufacturers.length} fabricante{filteredManufacturers.length !== 1 ? 's' : ''}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingManufacturer} onOpenChange={(open) => !open && setEditingManufacturer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Fabricante</DialogTitle>
            <DialogDescription>
              Actualiza la información del fabricante.
            </DialogDescription>
          </DialogHeader>
          <ManufacturerForm
            onSubmit={handleUpdate}
            initialData={editingManufacturer}
            onCancel={() => setEditingManufacturer(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        manufacturer={deletingManufacturer}
        open={!!deletingManufacturer}
        onOpenChange={(open) => !open && setDeletingManufacturer(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
