import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Home from '@/pages/Home';
import Categories from '@/pages/Categories';
import Brands from '@/pages/Brands';
import Manufacturers from '@/pages/Manufacturers';
import { LayoutDashboard, Tags, Award, Factory } from 'lucide-react';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
