import React from 'react';
import { motion } from 'framer-motion';
import { PixelGrid } from './ui/PixelGrid';

export const ViewTransition: React.FC<{ type: 'burn' | 'magic' }> = ({ type }) => {
    if (type === 'burn') {
        return (
            <motion.div
                className="fixed inset-0 z-50 bg-black"
                initial={{
                    maskImage: 'radial-gradient(circle, transparent 0%, black 0%)'
                }}
                animate={{
                    maskImage: 'radial-gradient(circle, transparent 0%, black 100%)',
                    transition: { duration: 0.6, ease: 'circOut' }
                }}
                exit={{
                    maskImage: 'radial-gradient(circle, transparent 100%, black 100%)',
                    transition: { duration: 0.6, ease: 'circIn', delay: 0.2 }
                }}
            />
        );
    }

    return <PixelGrid />;
};