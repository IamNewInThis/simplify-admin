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

export default function StoreForm({ onSubmit, onCancel, initialData = null }) {
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
            base_url: initialData?.base_url || '',
            active: initialData?.active ?? true,
        },
    });

    const handleFormSubmit = async (data) => {
        setError(null);
        setIsSubmitting(true);

        try {
            await onSubmit(data);
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
                <Label htmlFor="name">Nombre de la Tienda *</Label>
                <Input
                    id="name"
                    placeholder="Ej: Jumbo, Lider, Santa Isabel"
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
                <Label htmlFor="base_url">URL Base *</Label>
                <Input
                    id="base_url"
                    type="url"
                    placeholder="https://www.ejemplo.cl"
                    {...register('base_url', {
                        required: 'La URL es requerida',
                    })}
                />
                {errors.base_url && (
                    <p className="text-sm text-red-500">{errors.base_url.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                    URL principal del sitio web de la tienda
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
