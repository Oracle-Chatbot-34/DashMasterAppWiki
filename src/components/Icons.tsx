// Typically in a file like src/components/Icons.tsx
import React from 'react';

// Icono de Menú (Placeholder)
export const MenuIcon: React.FC = () => (
    <span className="w-6 h-6 inline-block" aria-label="Abrir menú">☰</span> // Placeholder
);

// Icono de Chevron Derecho (SVG Personalizado)
// Recibe className para permitir estilizado desde donde se usa (ej. tamaño, color).
export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => {
    // Clases por defecto si no se provee className, o se pueden combinar.
    // El Sidebar ya aplica w-4 h-4 y mr-1, así que podemos hacer el className opcional y que el Sidebar lo maneje.
    // Si no se pasa className, podría tener unos valores por defecto o ser requerido.
    // Por simplicidad, se espera que el componente que lo usa (Sidebar) aplique las clases de tamaño/margen.
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor" // El color será heredado del texto del elemento padre
            strokeWidth="2.5" // Un poco más grueso para mejor visibilidad en tamaño pequeño
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className || "w-4 h-4"} // Clases por defecto si no se proporcionan desde el Sidebar
            aria-hidden="true" // Es decorativo, el botón/span padre debe tener la etiqueta aria
        >
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    );
};
