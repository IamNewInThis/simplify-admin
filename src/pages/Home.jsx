export default function Home() {
    return (
        <div className="container mx-auto py-8">
            <div className="max-w-4xl">
                <h1 className="text-4xl font-bold mb-4">Simplify Admin</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Sistema de gestión para productos, marcas, tiendas y categorías.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h2 className="text-2xl font-semibold mb-2">Categorías</h2>
                        <p className="text-muted-foreground mb-4">
                            Gestiona las categorías de productos y su jerarquía.
                        </p>
                        <div className="text-sm text-muted-foreground">
                            ✓ Crear y editar categorías<br />
                            ✓ Organización jerárquica<br />
                            ✓ Control de estado (activo/inactivo)
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h2 className="text-2xl font-semibold mb-2">Fabricantes</h2>
                        <p className="text-muted-foreground mb-4">
                            Administra los fabricantes de marcas.
                        </p>
                        <div className="text-sm text-muted-foreground">
                            ✓ Crear y editar fabricantes<br />
                            ✓ Información fiscal y de negocio<br />
                            ✓ Gestión de marcas asociadas
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <h2 className="text-2xl font-semibold mb-2">Marcas</h2>
                        <p className="text-muted-foreground mb-4">
                            Gestiona las marcas de los productos.
                        </p>
                        <div className="text-sm text-muted-foreground">
                            ✓ Crear y editar marcas<br />
                            ✓ Asociar con fabricantes<br />
                            ✓ Control de estado (activo/inactivo)
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 opacity-50">
                        <h2 className="text-2xl font-semibold mb-2">Productos</h2>
                        <p className="text-muted-foreground mb-4">
                            Administra el catálogo de productos.
                        </p>
                        <div className="text-sm text-muted-foreground">
                            Próximamente...
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 opacity-50">
                        <h2 className="text-2xl font-semibold mb-2">Tiendas</h2>
                        <p className="text-muted-foreground mb-4">
                            Administra las tiendas y puntos de venta.
                        </p>
                        <div className="text-sm text-muted-foreground">
                            Próximamente...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
