import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Home from '@/pages/Home';
import Categories from '@/pages/Categories';
import Brands from '@/pages/Brands';
import Manufacturers from '@/pages/Manufacturers';
import Stores from '@/pages/Stores';
import ProductsCatalog from '@/pages/ProductsCatalog';
import Products from '@/pages/Products';
import { LayoutDashboard, Tags, Award, Factory, Store, Package, ShoppingCart } from 'lucide-react';
import './App.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Simplify Admin
          </Link>
          
          <div className="flex gap-2">
            <Link to="/">
              <Button variant={isActive('/') ? 'default' : 'ghost'}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Inicio
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant={isActive('/categories') ? 'default' : 'ghost'}>
                <Tags className="mr-2 h-4 w-4" />
                Categorías
              </Button>
            </Link>
            <Link to="/manufacturers">
              <Button variant={isActive('/manufacturers') ? 'default' : 'ghost'}>
                <Factory className="mr-2 h-4 w-4" />
                Fabricantes
              </Button>
            </Link>
            <Link to="/brands">
              <Button variant={isActive('/brands') ? 'default' : 'ghost'}>
                <Award className="mr-2 h-4 w-4" />
                Marcas
              </Button>
            </Link>
            <Link to="/products-catalog">
              <Button variant={isActive('/products-catalog') ? 'default' : 'ghost'}>
                <Package className="mr-2 h-4 w-4" />
                Catálogo
              </Button>
            </Link>
            <Link to="/products">
              <Button variant={isActive('/products') ? 'default' : 'ghost'}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Scrapeados
              </Button>
            </Link>
            <Link to="/stores">
              <Button variant={isActive('/stores') ? 'default' : 'ghost'}>
                <Store className="mr-2 h-4 w-4" />
                Tiendas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/manufacturers" element={<Manufacturers />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/products-catalog" element={<ProductsCatalog />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stores" element={<Stores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
