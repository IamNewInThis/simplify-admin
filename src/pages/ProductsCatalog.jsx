import { useState, useEffect } from 'react';
import { productsCatalogAPI, brandsAPI, categoriesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search, RefreshCw, Package } from 'lucide-react';
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
import ProductCatalogForm from '@/components/products/ProductCatalogForm';
import DeleteConfirmDialog from '@/components/products/DeleteConfirmDialog';

export default function ProductsCatalog() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);

    // Load products with details
    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await productsCatalogAPI.getWithDetails();
            setProducts(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar los productos');
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load brands and categories for the form
    const loadFormData = async () => {
        try {
            const [brandsData, categoriesData] = await Promise.all([
                brandsAPI.getAll(),
                categoriesAPI.getAll()
            ]);
            setBrands(brandsData);
            setCategories(categoriesData);
        } catch (err) {
            console.error('Error loading form data:', err);
        }
    };

    useEffect(() => {
        loadProducts();
        loadFormData();
    }, []);

    // Filter products by search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle create product
    const handleCreate = async (data) => {
        try {
            await productsCatalogAPI.create(data);
            setIsCreateDialogOpen(false);
            loadProducts();
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Error al crear el producto');
        }
    };

    // Handle update product
    const handleUpdate = async (data) => {
        try {
            await productsCatalogAPI.update(editingProduct.id, data);
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Error al actualizar el producto');
        }
    };

    // Handle delete product
    const handleDelete = async () => {
        try {
            await productsCatalogAPI.delete(deletingProduct.id);
            setDeletingProduct(null);
            loadProducts();
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al eliminar el producto');
            setDeletingProduct(null);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona los productos únicos del catálogo
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Crear Producto</DialogTitle>
                            <DialogDescription>
                                Crea un nuevo producto en el catálogo.
                            </DialogDescription>
                        </DialogHeader>
                        <ProductCatalogForm
                            onSubmit={handleCreate}
                            brands={brands}
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
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={loadProducts}
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
                            <TableHead>SKU</TableHead>
                            <TableHead>Marca</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Atributos</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    Cargando productos...
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    {searchTerm ? 'No se encontraron productos' : 'No hay productos creados'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium max-w-xs truncate">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {product.sku || '-'}
                                    </TableCell>
                                    <TableCell>{product.brand_name || '-'}</TableCell>
                                    <TableCell>{product.category_name || '-'}</TableCell>
                                    <TableCell>
                                        {product.attributes ? (
                                            <Badge variant="outline" className="gap-1">
                                                <Package className="h-3 w-3" />
                                                {Object.keys(product.attributes).length} atributo(s)
                                            </Badge>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.active ? 'default' : 'secondary'}>
                                            {product.active ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingProduct(product)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeletingProduct(product)}
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
                Total: {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Producto</DialogTitle>
                        <DialogDescription>
                            Actualiza la información del producto.
                        </DialogDescription>
                    </DialogHeader>
                    <ProductCatalogForm
                        onSubmit={handleUpdate}
                        brands={brands}
                        categories={categories}
                        initialData={editingProduct}
                        onCancel={() => setEditingProduct(null)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                product={deletingProduct}
                open={!!deletingProduct}
                onOpenChange={(open) => !open && setDeletingProduct(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
