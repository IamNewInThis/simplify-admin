# Simplifly Admin

Panel de administración para la gestión de productos, marcas, tiendas y categorías.

## Tecnologías

- **Vite** - Build tool y dev server
- **React** - Framework de UI
- **JavaScript** - Lenguaje de programación
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Agregar componentes de shadcn/ui

Para agregar nuevos componentes de shadcn/ui:

```bash
npx shadcn@latest add [nombre-del-componente]
```

Por ejemplo:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add dialog
```

## Estructura del proyecto

```
simplifly-admin/
├── src/
│   ├── components/
│   │   └── ui/          # Componentes de shadcn/ui
│   ├── lib/
│   │   └── utils.js     # Utilidades
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── components.json      # Configuración de shadcn/ui
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Módulos a implementar

- [ ] CRUD de Productos
- [ ] CRUD de Marcas
- [ ] CRUD de Tiendas
- [ ] CRUD de Categorías
