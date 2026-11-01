import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, BookOpen } from 'lucide-react';

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  snippet: string;
  category: string;
  href?: string;
}

interface KnowledgeBasePanelProps {
  open: boolean;
  onClose: () => void;
  articles?: KnowledgeBaseArticle[];
}

const KnowledgeBasePanel: React.FC<KnowledgeBasePanelProps> = ({
  open,
  onClose,
  articles = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.snippet.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  if (!open) return null;

  const content = (
    <>
      <div
        className='fixed inset-0 z-[100] bg-black/50 transition-opacity'
        onClick={onClose}
        aria-hidden
      />
      <div
        className='fixed top-0 right-0 bottom-0 z-[101] w-full max-w-md bg-white dark:bg-gray-800 shadow-xl flex flex-col overflow-hidden border-l border-gray-200 dark:border-gray-700'
        role='dialog'
        aria-modal='true'
        aria-labelledby='knowledge-base-panel-title'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0'>
          <h2
            id='knowledge-base-panel-title'
            className='text-lg font-semibold text-gray-900 dark:text-gray-100'
          >
            Knowledge base
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            aria-label='Close'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none' />
            <input
              type='search'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Search articles…'
              className='input-field pl-9 pr-3 py-2.5 text-sm rounded-xl w-full'
              aria-label='Search knowledge base'
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto min-h-0'>
          {filtered.length === 0 ? (
            <div className='p-6 text-center text-sm text-gray-500 dark:text-gray-400'>
              {articles.length === 0
                ? 'Knowledge base coming soon.'
                : 'No articles match your search.'}
            </div>
          ) : (
            <ul
              className='divide-y divide-gray-100 dark:divide-gray-700'
              role='list'
            >
              {filtered.map(article => (
                <li
                  key={article.id}
                  className='px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-700/80'
                >
                  <a
                    href={article.href ?? '#'}
                    className='block group'
                    onClick={e => {
                      if (!article.href) e.preventDefault();
                    }}
                  >
                    <div className='flex gap-3'>
                      <span
                        className='shrink-0 mt-0.5 text-gray-400 dark:text-gray-500'
                        aria-hidden
                      >
                        <BookOpen className='h-4 w-4' />
                      </span>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400'>
                          {article.title}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2'>
                          {article.snippet}
                        </p>
                        <span className='inline-block mt-1.5 text-xs text-gray-400 dark:text-gray-500'>
                          {article.category}
                        </span>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default KnowledgeBasePanel;
