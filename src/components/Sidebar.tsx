// Typically in a file like src/components/Sidebar.tsx
import React from 'react';
import { ChevronRightIcon } from './Icons'; // Asumiendo que Icons.tsx está en la misma carpeta

export interface Section { // Esta interface podría estar en un archivo types.ts
    id: string;
    title: string;
    level: number;
    content: string;
}

interface SidebarProps {
    sections: Section[];
    activeSectionId: string;
    onSectionClick: (id: string) => void;
    isOpen: boolean;
    // onClose: () => void; // onClose ya no es necesario aquí si se maneja con el overlay en App.tsx
}

export const Sidebar: React.FC<SidebarProps> = ({ sections, activeSectionId, onSectionClick, isOpen }) => {
    const handleItemClick = (id: string) => {
        onSectionClick(id);
    };

    // Helper para determinar si una sección se considera vacía (sin contenido clickeable)
    const isSectionEffectivelyEmpty = (sectionContent: string): boolean => {
        return !sectionContent || sectionContent.trim() === '';
    };

    return (
        <aside
            className={`fixed md:static inset-y-0 left-0 h-full z-20 w-72 bg-[#393631] border-r border-black/20 p-6 space-y-3 transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-scroll`}
            aria-label="Navegación principal de la Wiki"
        >
            <h1 className="text-3xl font-bold text-white mb-6">DashMaster Wiki</h1>
            <nav>
                <ul>
                    <li>
                        <button
                            onClick={() => handleItemClick('welcome')}
                            className={`flex items-center w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                                activeSectionId === 'welcome'
                                    ? 'bg-red-400 text-white' // Active state
                                    : 'text-white hover:bg-red-400/50 hover:text-white' // Inactive state
                            }`}
                        >
                            {/* No ChevronRightIcon for top-level "Bienvenido" */}
                            <span className="ml-1">Bienvenido</span> {/* Added ml-1 for alignment if needed */}
                        </button>
                    </li>
                    {sections.map(section => {
                        const isEmpty = isSectionEffectivelyEmpty(section.content);
                        const commonClasses = `flex items-center w-full text-left px-3 py-2.5 rounded-md text-sm font-medium`;
                        const levelClasses = section.level === 1 ? 'mt-2 font-semibold' : section.level === 2 ? 'ml-4' : 'ml-8 text-xs';
                        // Ajustar el padding para alinear el texto si el ícono no está presente en el nivel 1
                        // El ícono ChevronRightIcon tiene mr-1 (4px) y un ancho de w-4 (16px), total ~20px.
                        // Un padding de pl-[calc(1rem+4px)] o similar podría ser más preciso si el ícono tiene un tamaño específico.
                        // Por ahora, pl-[22px] es un valor visual. Si ChevronRightIcon es solo texto '>', su ancho es menor.
                        // Vamos a ajustar el padding para que los items de nivel 1 sin icono tengan el texto alineado con los que tienen icono.
                        // Si ChevronRightIcon es un span con mr-1, y su propio ancho, necesitamos calcular ese espacio.
                        // Si ChevronRightIcon es `w-4 h-4 mr-1` (16px + 4px = 20px).
                        // El padding por defecto es px-3 (12px). Si el ícono se renderiza, el texto empieza después de ícono + mr-1.
                        // Para items de nivel 1 sin ícono, para alinear, necesitarían un padding izquierdo adicional.
                        const paddingCorrection = section.level === 1 ? 'pl-[22px]' : '';


                        if (isEmpty) {
                            return (
                                <li key={section.id}>
                  <span
                      className={`${commonClasses} ${levelClasses} ${section.level === 1 ? paddingCorrection : ''} text-gray-400 cursor-default`} // Estilo para títulos no clickeables, color de texto más tenue
                  >
                    {section.level > 1 && <ChevronRightIcon />} {/* Chevron color inherited from text-gray-400 */}
                      {section.title}
                  </span>
                                </li>
                            );
                        }

                        return (
                            <li key={section.id}>
                                <button
                                    onClick={() => handleItemClick(section.id)}
                                    className={`${commonClasses} ${levelClasses} ${section.level === 1 ? paddingCorrection : ''} transition-colors duration-150 ${
                                        activeSectionId === section.id
                                            ? 'bg-red-400 text-white' // Active state
                                            : 'text-white hover:bg-red-400/50 hover:text-white' // Inactive state
                                    }`}
                                >
                                    {section.level > 1 && <ChevronRightIcon />} {/* Chevron color inherited from text-white */}
                                    {section.title}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
