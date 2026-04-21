import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchableSelect({ value, onChange, options = [], placeholder = 'Seleccionar...', emptyLabel = 'Sin asignar' }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const sorted = [...options].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    const filtered = sorted.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
    const selected = options.find(o => o.id === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const handleSelect = (id) => {
        onChange(id === value ? 'none' : id);
        setOpen(false);
        setSearch('');
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                    'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background',
                    'hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring',
                    !selected && 'text-muted-foreground',
                )}
            >
                <span className="truncate">{selected ? selected.name : placeholder}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            ref={inputRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar..."
                            className="flex h-9 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                        <button
                            type="button"
                            onClick={() => handleSelect('none')}
                            className={cn(
                                'flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
                                !value || value === 'none' ? 'font-medium' : 'text-muted-foreground',
                            )}
                        >
                            <Check className={cn('mr-2 h-4 w-4', (!value || value === 'none') ? 'opacity-100' : 'opacity-0')} />
                            {emptyLabel}
                        </button>
                        {filtered.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">Sin resultados</p>
                        ) : (
                            filtered.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => handleSelect(option.id)}
                                    className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Check className={cn('mr-2 h-4 w-4', value === option.id ? 'opacity-100' : 'opacity-0')} />
                                    {option.name}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
