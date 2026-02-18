import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface FilterState {
    experience: string | null;
    industry: string | null;
    organizationType: string | null;
    cluster: string | null;
}

interface FilterContextType {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [filters, setFilters] = useState<FilterState>({
        experience: null,
        industry: null,
        organizationType: null,
        cluster: null,
    });

    const resetFilters = () => {
        setFilters({
            experience: null,
            industry: null,
            organizationType: null,
            cluster: null,
        });
    };

    return (
        <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
};
