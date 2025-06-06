// Typically in a file like src/components/EnhancedMarkdownRenderer.tsx
import React, { useMemo } from 'react';

interface EnhancedMarkdownRendererProps {
    markdownContent: string;
}

// Para una aplicación real, considera usar una librería como react-markdown + remark-gfm
export const EnhancedMarkdownRenderer: React.FC<EnhancedMarkdownRendererProps> = ({ markdownContent }) => {
    const htmlContent = useMemo(() => {
        let html = markdownContent;

        // Convert **bold** and __bold__ to <strong>
        html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');
        // Convert *italic* and _italic_ to <em>
        html = html.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');
        // Convert `inline code` to <code>
        html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-sm">$1</code>');
        // Convert [link text](url) to <a>
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-sky-600 hover:text-sky-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

        // Convert lists (simple version)
        // Unordered lists
        html = html.replace(/^\s*-\s+(.*)/gm, '<li class="ml-5 list-disc">$1</li>');
        html = html.replace(/^\s*\*\s+(.*)/gm, '<li class="ml-5 list-disc">$1</li>');
        // Wrap consecutive <li> into <ul>
        html = html.replace(/(<li class="ml-5 list-disc">.*?<\/li>)+/gs, (match) => `<ul class="my-3">${match}</ul>`);

        // Ordered lists
        html = html.replace(/^\s*\d+\.\s+(.*)/gm, '<li class="ml-5 list-decimal">$1</li>');
        // Wrap consecutive <li> into <ol>
        html = html.replace(/(<li class="ml-5 list-decimal">.*?<\/li>)+/gs, (match) => `<ol class="my-3">${match}</ol>`);

        // Code blocks ```lang\ncode\n```
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
            const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<pre class="bg-slate-800 text-slate-100 p-4 rounded-md overflow-x-auto my-4 text-sm"><code class="language-${lang || ''}">${escapedCode.trim()}</code></pre>`;
        });

        // Paragraphs (naive approach: wrap lines that are not part of other structures)
        // This is very basic. Real Markdown parsers are more complex.
        // Ensure this runs after other replacements.
        html = html.split('\n').map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.length === 0) return '';
            if (trimmedLine.startsWith('<ul') || trimmedLine.startsWith('<ol') || trimmedLine.startsWith('<li') || trimmedLine.startsWith('<pre') || trimmedLine.endsWith('</ul>') || trimmedLine.endsWith('</ol>') || trimmedLine.endsWith('</li>') || trimmedLine.endsWith('</pre>')) {
                return line; // Don't wrap list items or code blocks in <p>
            }
            return `<p class="my-3 leading-relaxed">${line}</p>`;
        }).join('');
        html = html.replace(/<p class="my-3 leading-relaxed">\s*<\/p>/g, ''); // Remove empty paragraphs

        return html;
    }, [markdownContent]);

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default EnhancedMarkdownRenderer;
