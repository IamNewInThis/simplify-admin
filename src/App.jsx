import { Button } from '@/components/ui/button'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Simplifly Admin</h1>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Panel de Administración</h2>
          <p className="text-muted-foreground">
            Sistema de gestión para productos, marcas, tiendas y categorías.
          </p>
          
          <div className="flex gap-4 mt-6">
            <Button>Productos</Button>
            <Button variant="secondary">Marcas</Button>
            <Button variant="outline">Tiendas</Button>
            <Button variant="ghost">Categorías</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
