// Typically in a file like src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { MenuIcon } from './components/Icons'; // Asumiendo una estructura de carpetas
import Sidebar, {type Section } from './components/Sidebar';
import ContentDisplay from './components/ContentDisplay';
import Footer from './components/Footer'; // Importar el componente Footer

// --- Helper Functions ---
// Esta función sigue siendo útil para dividir el texto Markdown en secciones navegables.
const parseReadmeToSections = (markdown: string): Section[] => {
    const lines = markdown.split('\n');
    const sections: Section[] = [];
    let currentSectionLines: string[] = [];
    let currentTitle = '';
    let currentLevel = 0;
    let currentId = '';

    const finalizeSection = () => {
        if (currentTitle) {
            sections.push({
                id: currentId,
                title: currentTitle,
                level: currentLevel,
                content: currentSectionLines.join('\n').trim(),
            });
        }
    };

    lines.forEach(line => {
        const matchH1 = line.match(/^# (.*)/);
        const matchH2 = line.match(/^## (.*)/);
        const matchH3 = line.match(/^### (.*)/);

        let newTitle = '';
        let newLevel = 0;

        if (matchH1) { newTitle = matchH1[1]; newLevel = 1; }
        else if (matchH2) { newTitle = matchH2[1]; newLevel = 2; }
        else if (matchH3) { newTitle = matchH3[1]; newLevel = 3; }

        if (newTitle) {
            finalizeSection();
            currentLevel = newLevel;
            // Limpiar emojis para un ID más limpio, pero conservar para el título visible
            const cleanedTitle = newTitle.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{27BF}]/gu, '').trim();
            currentId = cleanedTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            currentTitle = newTitle;
            currentSectionLines = [];
        } else {
            currentSectionLines.push(line);
        }
    });

    finalizeSection();
    return sections;
};

// Main App Component
const App: React.FC = () => {
    const [readmeContent, setReadmeContent] = useState<string>('');
    const [sections, setSections] = useState<Section[]>([]);
    const [activeSectionId, setActiveSectionId] = useState<string>('welcome');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect para cargar el contenido del README.md desde la carpeta /public
    useEffect(() => {
        fetch('/README (1).md') // Carga el archivo desde la carpeta public
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo encontrar el archivo README.md. Asegúrate de que está en la carpeta `public`.');
                }
                return response.text();
            })
            .then(text => {
                setReadmeContent(text);
            })
            .catch(err => {
                console.error("Error al cargar el README:", err);
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); // El array vacío asegura que esto se ejecute solo una vez, al montar el componente.

    // useEffect para parsear el contenido una vez que se ha cargado.
    useEffect(() => {
        if (!readmeContent) return;

        const parsed = parseReadmeToSections(readmeContent);
        const filtered = parsed.filter(sec =>
            sec.title !== '📋 Table of Contents' &&
            !sec.title.includes("DashMaster - Enterprise Task Management Platform")
        );
        setSections(filtered);
        setActiveSectionId('welcome');
    }, [readmeContent]);

    const welcomeSection: Section = useMemo(() => ({
        id: 'welcome',
        title: 'Bienvenido a la Wiki de DashMaster',
        level: 0,
        content: `DashMaster is a modern, enterprise-grade task management platform designed for agile development teams. It provides comprehensive project tracking, team collaboration, sprint management, and advanced analytics through an intuitive web interface and integrated Telegram bot.
    Utiliza el menú de la izquierda para navegar por las diferentes secciones de la documentación.`
    }), []);

    const activeSectionDetails = useMemo(() => {
        if (activeSectionId === 'welcome') {
            return welcomeSection;
        }
        return sections.find(sec => sec.id === activeSectionId);
    }, [activeSectionId, sections, welcomeSection]);

    const handleSectionClick = (id: string) => {
        setActiveSectionId(id);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
        const contentArea = document.getElementById('contentArea');
        if (contentArea) contentArea.scrollTop = 0;
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Cargando documentación...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800">
            <div className="flex flex-1">
                <button
                    className="md:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-md shadow-lg text-slate-600"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-expanded={isSidebarOpen}
                    aria-controls="wiki-sidebar"
                >
                    <MenuIcon />
                    <span className="sr-only">Abrir menú de navegación</span>
                </button>

                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    ></div>
                )}

                <Sidebar
                    sections={sections}
                    activeSectionId={activeSectionId}
                    onSectionClick={handleSectionClick}
                    isOpen={isSidebarOpen}
                />

                <main id="contentArea" className="flex-1 p-6 md:p-10 overflow-y-auto" tabIndex={-1}>
                    <ContentDisplay section={activeSectionDetails} />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default App;
