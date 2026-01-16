import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const categorySchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
    description: z.string().max(500, 'Máximo 500 caracteres').optional().nullable(),
    parent_id: z.string().uuid().optional().nullable(),
    is_active: z.boolean().default(true),
});

export default function CategoryForm({ onSubmit, categories = [], initialData, onCancel }) {
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            parent_id: initialData?.parent_id || null,
            is_active: initialData?.is_active ?? true,
        },
    });

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Clean up data - convert empty strings to null
            const cleanData = {
                ...data,
                description: data.description?.trim() || null,
                parent_id: data.parent_id || null,
            };
            await onSubmit(cleanData);
        } catch (err) {
            setError(err.message || 'Error al guardar la categoría');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre *</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Electrónica" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descripción de la categoría..."
                                    className="resize-none"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormDescription>
                                Opcional. Máximo 500 caracteres.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categoría Padre</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value || undefined}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Ninguna (categoría raíz)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">Ninguna (categoría raíz)</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Opcional. Selecciona una categoría padre para crear una subcategoría.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(value === 'true')}
                                defaultValue={field.value ? 'true' : 'false'}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="true">Activa</SelectItem>
                                    <SelectItem value="false">Inactiva</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Las categorías inactivas no se mostrarán en el frontend.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
