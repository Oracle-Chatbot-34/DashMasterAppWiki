// Typically in a file like src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-200 text-slate-600 p-6 text-center text-sm border-t border-slate-300">
            <div className="max-w-4xl mx-auto">
                <p>
                    &copy; {currentYear} DashMaster Team. Todos los derechos reservados.
                </p>
                <p className="mt-1">
                    DashMaster es software propietario.
                </p>
                {/* Puedes agregar más enlaces o información aquí si es necesario */}
                {/* Ejemplo: <a href="/terms" className="hover:underline">Términos de Servicio</a> */}
            </div>
        </footer>
    );
};

export default Footer;
