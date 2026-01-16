import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmDialog({ category, onConfirm, onCancel }) {
    if (!category) return null;

    return (
        <Dialog open={!!category} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Eliminar categoría?</DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>

                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Estás a punto de eliminar la categoría <strong>{category.name}</strong>.
                        {category.parent_id && (
                            <span className="block mt-2">
                                Esta es una subcategoría y su eliminación no afectará a la categoría padre.
                            </span>
                        )}
                    </AlertDescription>
                </Alert>

                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
