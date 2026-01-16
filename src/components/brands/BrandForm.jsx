import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function BrandForm({ onSubmit, onCancel, manufacturers = [], initialData = null }) {
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: initialData?.name || '',
            manufacturer_id: initialData?.manufacturer_id || '',
            active: initialData?.active ?? true,
        },
    });

    const manufacturerId = watch('manufacturer_id');

    const handleFormSubmit = async (data) => {
        setError(null);
        setIsSubmitting(true);

        try {
            // Clean data - remove manufacturer_id if it's 'none' or null
            const cleanData = {
                name: data.name,
                active: data.active,
            };

            if (data.manufacturer_id && data.manufacturer_id !== 'none') {
                cleanData.manufacturer_id = data.manufacturer_id;
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
                <Label htmlFor="name">Nombre de la Marca *</Label>
                <Input
                    id="name"
                    placeholder="Ej: Nike, Apple, Samsung"
                    {...register('name', {
                        required: 'El nombre es requerido',
                        minLength: { value: 1, message: 'El nombre debe tener al menos 1 caracter' },
                        maxLength: { value: 255, message: 'El nombre no puede exceder 255 caracteres' },
                    })}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="manufacturer">Fabricante (Opcional)</Label>
                <Select
                    value={manufacturerId || 'none'}
                    onValueChange={(value) => setValue('manufacturer_id', value === 'none' ? null : value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un fabricante (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin fabricante</SelectItem>
                        {Array.isArray(manufacturers) && manufacturers.length > 0 ? (
                            manufacturers.map((manufacturer) => (
                                <SelectItem key={manufacturer.id} value={manufacturer.id}>
                                    {manufacturer.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                                No hay fabricantes disponibles
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                    El fabricante es la empresa que produce la marca
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
                        <SelectItem value="true">Activa</SelectItem>
                        <SelectItem value="false">Inactiva</SelectItem>
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
