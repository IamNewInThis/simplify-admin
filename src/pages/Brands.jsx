import { useState, useEffect } from 'react';
import { brandsAPI, manufacturersAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Search, RefreshCw, Filter, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import BrandForm from '@/components/brands/BrandForm';
import DeleteConfirmDialog from '@/components/brands/DeleteConfirmDialog';

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [deletingBrand, setDeletingBrand] = useState(null);
    
    // Filtros
    const [selectedManufacturer, setSelectedManufacturer] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    
    // Selección múltiple
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Load brands with manufacturer info
    const loadBrands = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await brandsAPI.getWithManufacturer();
            setBrands(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al cargar las marcas');
            console.error('Error loading brands:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load manufacturers for the form
    const loadManufacturers = async () => {
        try {
            const data = await manufacturersAPI.getAll();
            setManufacturers(data);
        } catch (err) {
            console.error('Error loading manufacturers:', err);
        }
    };

    useEffect(() => {
        loadBrands();
        loadManufacturers();
    }, []);

    // Filter brands by search term
    const filteredBrands = brands.filter(brand => {
        const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            brand.manufacturer_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesManufacturer = selectedManufacturer === 'all' || 
            String(brand.manufacturer_id) === String(selectedManufacturer);
        
        const matchesStatus = selectedStatus === 'all' || 
            (selectedStatus === 'active' && brand.active) ||
            (selectedStatus === 'inactive' && !brand.active);
        
        return matchesSearch && matchesManufacturer && matchesStatus;
    });

    // Handle create brand
    const handleCreate = async (data) => {
        try {
            await brandsAPI.create(data);
            setIsCreateDialogOpen(false);
            loadBrands();
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Error al crear la marca');
        }
    };

    // Handle update brand
    const handleUpdate = async (data) => {
        try {
            await brandsAPI.update(editingBrand.id, data);
            setEditingBrand(null);
            loadBrands();
        } catch (err) {
            throw new Error(err.response?.data?.detail || 'Error al actualizar la marca');
        }
    };

    // Handle delete brand
    const handleDelete = async () => {
        try {
            await brandsAPI.delete(deletingBrand.id);
            setDeletingBrand(null);
            loadBrands();
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al eliminar la marca');
            setDeletingBrand(null);
        }
    };

    // Manejar selección individual
    const handleSelectBrand = (brandId) => {
        setSelectedBrands(prev => 
            prev.includes(brandId) 
                ? prev.filter(id => id !== brandId)
                : [...prev, brandId]
        );
    };

    // Manejar seleccionar todos
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedBrands([]);
            setSelectAll(false);
        } else {
            setSelectedBrands(filteredBrands.map(brand => brand.id));
            setSelectAll(true);
        }
    };

    // Eliminar marcas seleccionadas
    const handleDeleteSelected = async () => {
        try {
            await Promise.all(
                selectedBrands.map(id => brandsAPI.delete(id))
            );
            setSelectedBrands([]);
            setSelectAll(false);
            loadBrands();
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al eliminar las marcas');
        }
    };

    // Limpiar filtros
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedManufacturer('all');
        setSelectedStatus('all');
    };

    // Actualizar selectAll cuando cambian los filtros
    useEffect(() => {
        if (filteredBrands.length > 0 && selectedBrands.length === filteredBrands.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedBrands, filteredBrands]);

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Marcas</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona las marcas de productos
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Marca
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear Marca</DialogTitle>
                            <DialogDescription>
                                Crea una nueva marca para tus productos.
                            </DialogDescription>
                        </DialogHeader>
                        <BrandForm
                            onSubmit={handleCreate}
                            manufacturers={manufacturers}
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

            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar marcas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={loadBrands}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {showFilters && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-2 block">
                                    Fabricante
                                </label>
                                <Select
                                    value={selectedManufacturer}
                                    onValueChange={setSelectedManufacturer}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los fabricantes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los fabricantes</SelectItem>
                                        {manufacturers.map((manufacturer) => (
                                            <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                                                {manufacturer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-2 block">
                                    Estado
                                </label>
                                <Select
                                    value={selectedStatus}
                                    onValueChange={setSelectedStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los estados" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="active">Activas</SelectItem>
                                        <SelectItem value="inactive">Inactivas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={handleClearFilters}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Limpiar
                            </Button>
                        </div>
                    </div>
                )}

                {selectedBrands.length > 0 && (
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                        <span className="text-sm font-medium">
                            {selectedBrands.length} marca{selectedBrands.length !== 1 ? 's' : ''} seleccionada{selectedBrands.length !== 1 ? 's' : ''}
                        </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteSelected}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar seleccionadas
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedBrands([]);
                                setSelectAll(false);
                            }}
                        >
                            Cancelar
                        </Button>
                    </div>
                )}
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Fabricante</TableHead>
                            <TableHead>País</TableHead>
                            <TableHead>Productos</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    Cargando marcas...
                                </TableCell>
                            </TableRow>
                        ) : filteredBrands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    {searchTerm || selectedManufacturer !== 'all' || selectedStatus !== 'all' 
                                        ? 'No se encontraron marcas con los filtros aplicados' 
                                        : 'No hay marcas creadas'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBrands.map((brand) => (
                                <TableRow key={brand.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedBrands.includes(brand.id)}
                                            onCheckedChange={() => handleSelectBrand(brand.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{brand.name}</TableCell>
                                    <TableCell>{brand.manufacturer_name || '-'}</TableCell>
                                    <TableCell>{brand.manufacturer_country || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{brand.product_count}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={brand.active ? 'default' : 'secondary'}>
                                            {brand.active ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingBrand(brand)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeletingBrand(brand)}
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
                Total: {filteredBrands.length} marca{filteredBrands.length !== 1 ? 's' : ''}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingBrand} onOpenChange={(open) => !open && setEditingBrand(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Marca</DialogTitle>
                        <DialogDescription>
                            Actualiza la información de la marca.
                        </DialogDescription>
                    </DialogHeader>
                    <BrandForm
                        onSubmit={handleUpdate}
                        manufacturers={manufacturers}
                        initialData={editingBrand}
                        onCancel={() => setEditingBrand(null)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                brand={deletingBrand}
                open={!!deletingBrand}
                onOpenChange={(open) => !open && setDeletingBrand(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
