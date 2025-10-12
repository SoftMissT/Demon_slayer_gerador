import React, { useState, useEffect, useRef } from 'react';
import type { GeneratedItem } from '../types';
import { ResultCard } from './ResultCard';
import { ResultCardSkeleton } from './ResultCardSkeleton';

interface LazyResultCardProps {
  item: GeneratedItem;
  isSelected: boolean;
  onSelect: (item: GeneratedItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
}

export const LazyResultCard: React.FC<LazyResultCardProps> = (props) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: '0px 0px 200px 0px', // Pre-load cards 200px before they enter the viewport
            }
        );

        const currentRef = cardRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div ref={cardRef} className="min-h-[140px]">
            {isVisible ? <ResultCard {...props} /> : <ResultCardSkeleton />}
        </div>
    );
};
