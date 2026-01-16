import { useState, useEffect } from 'react';
import { storesAPI } from '@/lib/api';
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
import StoreForm from '@/components/stores/StoreForm';
import DeleteConfirmDialog from '@/components/stores/DeleteConfirmDialog';

export default function Stores() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingStore, setEditingStore] = useState(null);
    const [deletingStore, setDeletingStore] = useState(null);

    // Load stores
    const loadStores = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await storesAPI.getAll();
            setStores(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar las tiendas');
            console.error('Error loading stores:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, []);

    // Filter stores by search term
    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.base_url?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle create store
    const handleCreate = async (data) => {
        try {
            await storesAPI.create(data);
            setIsCreateDialogOpen(false);
            loadStores();
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Error al crear la tienda');
        }
    };

    // Handle update store
    const handleUpdate = async (data) => {
        try {
            await storesAPI.update(editingStore.id, data);
            setEditingStore(null);
            loadStores();
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Error al actualizar la tienda');
        }
    };

    // Handle delete store
    const handleDelete = async () => {
        try {
            await storesAPI.delete(deletingStore.id);
            setDeletingStore(null);
            loadStores();
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al eliminar la tienda');
            setDeletingStore(null);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Tiendas</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona las tiendas y comercios
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Tienda
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear Tienda</DialogTitle>
                            <DialogDescription>
                                Crea una nueva tienda para registrar productos.
                            </DialogDescription>
                        </DialogHeader>
                        <StoreForm
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
                        placeholder="Buscar tiendas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={loadStores}
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
                            <TableHead>URL Base</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Cargando tiendas...
                                </TableCell>
                            </TableRow>
                        ) : filteredStores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? 'No se encontraron tiendas' : 'No hay tiendas creadas'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStores.map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell className="font-medium">{store.name}</TableCell>
                                    <TableCell>
                                        <a
                                            href={store.base_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            {store.base_url}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={store.active ? 'default' : 'secondary'}>
                                            {store.active ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingStore(store)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeletingStore(store)}
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
                Total: {filteredStores.length} tienda{filteredStores.length !== 1 ? 's' : ''}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingStore} onOpenChange={(open) => !open && setEditingStore(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Tienda</DialogTitle>
                        <DialogDescription>
                            Actualiza la información de la tienda.
                        </DialogDescription>
                    </DialogHeader>
                    <StoreForm
                        onSubmit={handleUpdate}
                        initialData={editingStore}
                        onCancel={() => setEditingStore(null)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                store={deletingStore}
                open={!!deletingStore}
                onOpenChange={(open) => !open && setDeletingStore(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
