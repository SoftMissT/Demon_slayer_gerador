import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { FilterIcon } from './icons/FilterIcon';
import { KatanaIcon } from './icons/KatanaIcon';
import { Tooltip } from './ui/Tooltip';
import { AnvilIcon } from './icons/AnvilIcon';

interface CollapsibleColumnProps {
    children: React.ReactNode;
    isCollapsed: boolean;
    onToggle: () => void;
    position: 'left' | 'middle' | 'right';
    className?: string;
}

export const CollapsibleColumn: React.FC<CollapsibleColumnProps> = ({
    children,
    isCollapsed,
    onToggle,
    position,
    className = ''
}) => {
    const columnConfig = {
        left: { title: 'Filtros', Icon: FilterIcon, ButtonIcon: ChevronLeftIcon },
        middle: { title: 'Resultados', Icon: AnvilIcon, ButtonIcon: ChevronRightIcon },
        right: { title: 'Detalhes', Icon: KatanaIcon, ButtonIcon: ChevronRightIcon }
    };
    const { title: columnTitle, Icon, ButtonIcon: IconComponent } = columnConfig[position];

    const variants = {
        open: { width: 'auto', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        collapsed: { width: '2.5rem', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };

    const buttonVariants = {
        open: { rotate: 0 },
        collapsed: { rotate: 180 },
    };

    const buttonPositionClass = position === 'left' 
        ? 'right-0 translate-x-1/2 rounded-r-md' 
        : 'left-0 -translate-x-1/2 rounded-l-md';

    return (
        <motion.div
            initial={false}
            animate={isCollapsed ? 'collapsed' : 'open'}
            variants={variants}
            className={`relative flex-shrink-0 h-full ${className}`}
        >
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.2 } }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        className="h-full w-full overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

             {isCollapsed && (
                 <div className="h-full w-full flex items-center justify-center bg-gray-800/30 rounded-lg">
                     <div className="flex flex-col items-center justify-center h-full">
                        <Icon className="w-6 h-6 mb-2 text-gray-400" />
                        <p className="font-bold text-gray-400 writing-vertical-rl rotate-180 whitespace-nowrap">{columnTitle}</p>
                     </div>
                 </div>
            )}
            
            <Tooltip text={isCollapsed ? `Expandir ${columnTitle}` : `Recolher ${columnTitle}`}>
                <button
                    onClick={onToggle}
                    className={`absolute top-5 w-6 h-12 bg-gray-800 hover:bg-[var(--accent-primary)] text-white flex items-center justify-center transition-colors
                    ${buttonPositionClass}`}
                    style={{ zIndex: 10 }}
                >
                    <motion.div initial={false} animate={isCollapsed ? 'collapsed' : 'open'} variants={buttonVariants}>
                        <IconComponent className="w-5 h-5" />
                    </motion.div>
                </button>
            </Tooltip>
        </motion.div>
    );
};