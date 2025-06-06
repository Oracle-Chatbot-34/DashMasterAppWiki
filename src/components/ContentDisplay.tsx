// Typically in a file like src/components/ContentDisplay.tsx
import React from 'react';
import EnhancedMarkdownRenderer from './EnhancedMarkdownRenderer'; // O import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm'; // si usas react-markdown
// import remarkGfm from 'remark-gfm'; // si usas react-markdown
import type {Section} from './Sidebar'; // Reutilizando la interface Section
import bannerImage from '../assets/banner1.png'; // Importa la imagen de bienvenida si la necesitas
// Reutilizando la interface Section

interface ContentDisplayProps {
    section: Section | undefined;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ section }) => {
    if (!section) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-500">Selecciona una sección del menú.</p>
            </div>
        );
    }

    // Si estuvieras usando react-markdown:
    // return (
    //   <article className="prose prose-slate max-w-none bg-white p-6 md:p-8 rounded-lg shadow">
    //     <ReactMarkdown remarkPlugins={[remarkGfm]}>{`# ${section.title}\n${section.content}`}</ReactMarkdown>
    //     {section.id === 'welcome' && (
    //       <div className="w-full h-64 bg-slate-200 rounded-md my-6 flex items-center justify-center text-slate-500">
    //         [Espacio para la imagen de bienvenida de DashMaster App]
    //       </div>
    //     )}
    //   </article>
    // );

    // Implementación actual con el renderizador simple
    //Link al repositorio de DashMaster App
    return (
        <article className="prose prose-slate h-full max-w-none bg-white p-6 md:p-8 rounded-lg shadow">

            <h1 className="text-4xl font-bold mb-6 pb-2 border-b border-slate-300">{section.title}</h1>
            <a href={'https://github.com/Oracle-Chatbot-34/oracle-todo-app'}>
                <h2 className="text-2xl underline underline-offset-auto font-semibold mb-4">DashMaster App Github Repository</h2>
                <img
                    src="https://img.shields.io/github/stars/Oracle-Chatbot-34/oracle-todo-app?style=social"
                    alt="GitHub Repo stars"
                    className="mb-4" // Añadir margen inferior para separación


                />
            </a>
            <EnhancedMarkdownRenderer markdownContent={section.content} />
            {section.id === 'welcome' && (
                <div className="w-full h-64 bg-[#ea2729] rounded-md my-6 flex items-center justify-center text-slate-500">
                    <img
                        src={bannerImage} // Asegúrate de que la ruta sea correcta
                        alt="Imagen de bienvenida de DashMaster App"
                        className="max-w-full max-h-full object-contain"


                    />
                </div>
            )}
        </article>
    );
};

export default ContentDisplay;
