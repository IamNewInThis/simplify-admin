import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search, RefreshCw } from 'lucide-react';
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
import CategoryForm from '@/components/categories/CategoryForm';
import DeleteConfirmDialog from '@/components/categories/DeleteConfirmDialog';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);

    // Load categories
    const loadCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await categoriesAPI.getAll();
            setCategories(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar las categorías');
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Filter categories by search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle create category
    const handleCreate = async (data) => {
        try {
            await categoriesAPI.create(data);
            setIsCreateDialogOpen(false);
            loadCategories();
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Error al crear la categoría');
        }
    };

    // Handle update category
    const handleUpdate = async (data) => {
        try {
            await categoriesAPI.update(editingCategory.id, data);
            setEditingCategory(null);
            loadCategories();
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Error al actualizar la categoría');
        }
    };

    // Handle delete category
    const handleDelete = async () => {
        try {
            await categoriesAPI.delete(deletingCategory.id);
            setDeletingCategory(null);
            loadCategories();
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al eliminar la categoría');
            setDeletingCategory(null);
        }
    };

    // Get parent category name
    const getParentName = (parentId) => {
        if (!parentId) return '-';
        const parent = categories.find(cat => cat.id === parentId);
        return parent?.name || 'N/A';
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Categorías</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona las categorías de productos
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Categoría
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear Categoría</DialogTitle>
                            <DialogDescription>
                                Crea una nueva categoría para organizar tus productos.
                            </DialogDescription>
                        </DialogHeader>
                        <CategoryForm
                            onSubmit={handleCreate}
                            categories={categories}
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
                        placeholder="Buscar categorías..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={loadCategories}
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
                            <TableHead>Descripción</TableHead>
                            <TableHead>Categoría Padre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Cargando categorías...
                                </TableCell>
                            </TableRow>
                        ) : filteredCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? 'No se encontraron categorías' : 'No hay categorías creadas'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {category.description || '-'}
                                    </TableCell>
                                    <TableCell>{getParentName(category.parent_id)}</TableCell>
                                    <TableCell>
                                        <Badge variant={category.active ? 'default' : 'secondary'}>
                                            {category.active ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingCategory(category)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeletingCategory(category)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Categoría</DialogTitle>
                        <DialogDescription>
                            Modifica la información de la categoría.
                        </DialogDescription>
                    </DialogHeader>
                    {editingCategory && (
                        <CategoryForm
                            onSubmit={handleUpdate}
                            categories={categories.filter(cat => cat.id !== editingCategory.id)}
                            initialData={editingCategory}
                            onCancel={() => setEditingCategory(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                category={deletingCategory}
                onConfirm={handleDelete}
                onCancel={() => setDeletingCategory(null)}
            />

            <div className="mt-4 text-sm text-muted-foreground">
                Total: {filteredCategories.length} categoría{filteredCategories.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
}
