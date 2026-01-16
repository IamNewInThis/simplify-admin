import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

export default function ManufacturerForm({ onSubmit, onCancel, initialData = null }) {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      tax_id: initialData?.tax_id || '',
      country: initialData?.country || '',
      website: initialData?.website || '',
      main_business_line: initialData?.main_business_line || '',
    },
  });

  const handleFormSubmit = async (data) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Clean data - remove empty strings
      const cleanData = {};
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].trim() !== '') {
          cleanData[key] = data[key].trim();
        }
      });
      
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
        <Label htmlFor="name">Nombre del Fabricante *</Label>
        <Input
          id="name"
          placeholder="Ej: Apple Inc., Samsung Electronics, Nestlé"
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
        <Label htmlFor="tax_id">ID Fiscal (RUT/NIT/EIN)</Label>
        <Input
          id="tax_id"
          placeholder="Ej: 76.123.456-7"
          {...register('tax_id', {
            maxLength: { value: 100, message: 'El ID fiscal no puede exceder 100 caracteres' },
          })}
        />
        {errors.tax_id && (
          <p className="text-sm text-red-500">{errors.tax_id.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Número de identificación fiscal de la empresa
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">País de Origen</Label>
        <Input
          id="country"
          placeholder="Ej: Chile, Estados Unidos, China"
          {...register('country', {
            maxLength: { value: 100, message: 'El país no puede exceder 100 caracteres' },
          })}
        />
        {errors.country && (
          <p className="text-sm text-red-500">{errors.country.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Sitio Web</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://www.ejemplo.com"
          {...register('website')}
        />
        <p className="text-sm text-muted-foreground">
          URL del sitio web corporativo
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="main_business_line">Giro Principal de Negocio</Label>
        <Input
          id="main_business_line"
          placeholder="Ej: Electrónica de consumo, Alimentos y bebidas"
          {...register('main_business_line', {
            maxLength: { value: 255, message: 'No puede exceder 255 caracteres' },
          })}
        />
        {errors.main_business_line && (
          <p className="text-sm text-red-500">{errors.main_business_line.message}</p>
        )}
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
