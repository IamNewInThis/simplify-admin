import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, ExternalLink, Calendar, DollarSign, Store } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Alert,
    AlertDescription,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Load scraped products
    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar los productos scrapeados');
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Filter products
    const filteredProducts = products.filter(product =>
        product.catalog_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format price
    const formatPrice = (price) => {
        if (!price) return '-';
        return `$${Number(price).toLocaleString('es-CL')}`;
    };

    // Group by catalog product
    const groupedProducts = filteredProducts.reduce((acc, product) => {
        const key = product.catalog_id;
        if (!acc[key]) {
            acc[key] = {
                catalog_id: product.catalog_id,
                catalog_name: product.catalog_name,
                catalog_sku: product.catalog_sku,
                category_name: product.category_name,
                brand_name: product.brand_name,
                stores: []
            };
        }
        acc[key].stores.push(product);
        return acc;
    }, {});

    const groupedList = Object.values(groupedProducts);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Productos Scrapeados</h1>
                    <p className="text-muted-foreground">
                        Gestiona los productos con precios obtenidos de diferentes tiendas
                    </p>
                </div>
                <Button onClick={loadProducts} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Store className="h-4 w-4" />
                        Total Productos
                    </div>
                    <div className="mt-2 text-2xl font-bold">{filteredProducts.length}</div>
                </div>
                <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        Productos en Catálogo
                    </div>
                    <div className="mt-2 text-2xl font-bold">{groupedList.length}</div>
                </div>
                <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Última Actualización
                    </div>
                    <div className="mt-2 text-sm">
                        {products.length > 0 ? formatDate(products[0].last_scraped_at) : '-'}
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, tienda o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Products List - Grouped */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-12">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Cargando productos...</p>
                    </div>
                ) : groupedList.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg">
                        <p className="text-muted-foreground">No se encontraron productos scrapeados</p>
                    </div>
                ) : (
                    groupedList.map((group) => (
                        <div key={group.catalog_id} className="border rounded-lg overflow-hidden">
                            {/* Product Header */}
                            <div className="bg-muted/50 p-4 border-b">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">{group.catalog_name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {group.catalog_sku && (
                                                <Badge variant="outline">SKU: {group.catalog_sku}</Badge>
                                            )}
                                            {group.brand_name && (
                                                <Badge variant="secondary">{group.brand_name}</Badge>
                                            )}
                                            {group.category_name && (
                                                <Badge variant="outline">{group.category_name}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Badge variant="secondary">
                                        {group.stores.length} tienda{group.stores.length !== 1 ? 's' : ''}
                                    </Badge>
                                </div>
                            </div>

                            {/* Stores Table */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tienda</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Última Actualización</TableHead>
                                        <TableHead>URL</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {group.stores.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {product.store_name}
                                                    {!product.store_active && (
                                                        <Badge variant="warning" className="text-xs">
                                                            Pendiente
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-lg">
                                                    {product.price ? formatPrice(product.price.price) : '-'}
                                                </span>
                                                {product.price?.original_price && product.price.original_price > product.price.price && (
                                                    <div className="text-xs text-muted-foreground line-through">
                                                        {formatPrice(product.price.original_price)}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {product.price?.in_stock ? (
                                                    <Badge variant="success">En Stock</Badge>
                                                ) : (
                                                    <Badge variant="destructive">Sin Stock</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(product.last_scraped_at)}
                                            </TableCell>
                                            <TableCell>
                                                {product.url && (
                                                    <a
                                                        href={product.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                                    >
                                                        Ver
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
