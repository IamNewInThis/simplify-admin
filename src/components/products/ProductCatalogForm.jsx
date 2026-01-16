import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function ProductCatalogForm({ onSubmit, onCancel, brands = [], categories = [], initialData = null }) {
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attributesText, setAttributesText] = useState(
        initialData?.attributes ? JSON.stringify(initialData.attributes, null, 2) : ''
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: initialData?.name || '',
            sku: initialData?.sku || '',
            brand_id: initialData?.brand_id || 'none',
            category_id: initialData?.category_id || 'none',
            active: initialData?.active ?? true,
        },
    });

    const handleFormSubmit = async (data) => {
        setError(null);
        setIsSubmitting(true);

        try {
            const cleanData = {
                name: data.name,
                active: data.active,
            };

            // Add SKU if provided
            if (data.sku && data.sku.trim() !== '') {
                cleanData.sku = data.sku.trim();
            }

            // Add brand_id if selected
            if (data.brand_id && data.brand_id !== 'none') {
                cleanData.brand_id = data.brand_id;
            }

            // Add category_id if selected
            if (data.category_id && data.category_id !== 'none') {
                cleanData.category_id = data.category_id;
            }

            // Parse attributes JSON if provided
            if (attributesText.trim() !== '') {
                try {
                    cleanData.attributes = JSON.parse(attributesText);
                } catch (e) {
                    throw new Error('Los atributos deben ser un JSON válido');
                }
            }

            await onSubmit(cleanData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                    id="name"
                    placeholder="Ej: iPhone 15 Pro Max 256GB"
                    {...register('name', {
                        required: 'El nombre es requerido',
                        minLength: { value: 1, message: 'El nombre debe tener al menos 1 caracter' },
                        maxLength: { value: 500, message: 'El nombre no puede exceder 500 caracteres' },
                    })}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="sku">SKU (Código de Producto)</Label>
                <Input
                    id="sku"
                    placeholder="Ej: IPHONE15PM-256-BLK"
                    {...register('sku', {
                        maxLength: { value: 100, message: 'El SKU no puede exceder 100 caracteres' },
                    })}
                />
                {errors.sku && (
                    <p className="text-sm text-red-500">{errors.sku.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                    Código único de identificación del producto (opcional)
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Select
                        value={watch('brand_id')}
                        onValueChange={(value) => setValue('brand_id', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una marca" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin marca</SelectItem>
                            {Array.isArray(brands) && brands.length > 0 ? (
                                brands.map((brand) => (
                                    <SelectItem key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-data" disabled>
                                    No hay marcas disponibles
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                        value={watch('category_id')}
                        onValueChange={(value) => setValue('category_id', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin categoría</SelectItem>
                            {Array.isArray(categories) && categories.length > 0 ? (
                                categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-data" disabled>
                                    No hay categorías disponibles
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="attributes">Atributos (JSON)</Label>
                <Textarea
                    id="attributes"
                    placeholder='{"color": "Negro", "capacidad": "256GB", "pantalla": "6.7 pulgadas"}'
                    value={attributesText}
                    onChange={(e) => setAttributesText(e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                    Atributos adicionales del producto en formato JSON (opcional)
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="active">Estado</Label>
                <Select
                    value={watch('active').toString()}
                    onValueChange={(value) => setValue('active', value === 'true')}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Inactivo</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
                </Button>
            </div>
        </form>
    );
}
