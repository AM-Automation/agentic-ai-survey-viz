import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilters } from '../context/FilterContext';
import styled from 'styled-components';

const FilterContainer = styled(motion.div)`
  margin: 0 auto 40px;
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  position: sticky;
  top: 20px;
  z-index: 100;
  padding: 12px;
  border-radius: 20px;
  background: rgba(20, 20, 25, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const FilterLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Select = styled.select`
  background: transparent;
  color: var(--text-primary);
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  option {
    background: #1a1a20;
    color: white;
  }
`;

const ResetButton = styled(motion.button)`
  background: rgba(161, 0, 255, 0.1);
  color: #c077ff;
  border: 1px solid rgba(161, 0, 255, 0.2);
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(161, 0, 255, 0.2);
    border-color: rgba(161, 0, 255, 0.3);
  }
`;


export const FilterBar: React.FC = () => {
    const { filters, setFilters, resetFilters } = useFilters();

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'all' ? null : value
        }));
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== null);

    return (
        <FilterContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <FilterGroup>
                <FilterLabel>Experience</FilterLabel>
                <Select
                    value={filters.experience || 'all'}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                >
                    <option value="all">All Experience Levels</option>
                    <option value="&lt; 2 years">&lt; 2 years</option>
                    <option value="2–5 years">2–5 years</option>
                    <option value="6–10 years">6–10 years</option>
                    <option value="&gt; 10 years">&gt; 10 years</option>
                </Select>
            </FilterGroup>

            <FilterGroup>
                <FilterLabel>Industry</FilterLabel>
                <Select
                    value={filters.industry || 'all'}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                >
                    <option value="all">All Industries</option>
                    <option value="Banking /&nbsp;&nbsp;Insurance">Banking / Insurance</option>
                    <option value="Communications, Media &amp; Technology">Tech, Media &amp; Comms</option>
                    <option value="Health /&nbsp;&nbsp;Public Service">Health / Public Service</option>
                    <option value="Aerospace &amp; Defense">Aerospace &amp; Defense</option>
                    <option value="Products (Automotive, Consumer Goods, Retail, Travel)">Products &amp; Retail</option>
                    <option value="Resources (Energy, Utilities, Chemicals)">Energy &amp; Resources</option>
                </Select>
            </FilterGroup>

            <FilterGroup>
                <FilterLabel>Org Type</FilterLabel>
                <Select
                    value={filters.organizationType || 'all'}
                    onChange={(e) => handleFilterChange('organizationType', e.target.value)}
                >
                    <option value="all">All Org Types</option>
                    <option value="Large enterprise (&gt; 250 employees)">Large Enterprise (&gt; 250)</option>
                    <option value="Mid-size company (50–250 employees)">Mid-size (50–250)</option>
                    <option value="Small company&nbsp;&nbsp;(&lt; 50 employees)">Small Comp. (&lt; 50)</option>
                    <option value="Freelance / Solo Developer">Freelance / Solo</option>
                </Select>
            </FilterGroup>

            <AnimatePresence>
                {hasActiveFilters && (
                    <ResetButton
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={resetFilters}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reset All
                    </ResetButton>
                )}
            </AnimatePresence>
        </FilterContainer>
    );
};
