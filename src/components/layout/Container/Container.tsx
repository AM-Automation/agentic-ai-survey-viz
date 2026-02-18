import styled from 'styled-components';

interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
}

const sizeMap = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  full: '100%',
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: ${({ size = 'xl' }) => sizeMap[size]};
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ theme, noPadding }) => (noPadding ? '0' : theme.spacing[6])};
  padding-right: ${({ theme, noPadding }) => (noPadding ? '0' : theme.spacing[6])};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: ${({ theme, noPadding }) => (noPadding ? '0' : theme.spacing[4])};
    padding-right: ${({ theme, noPadding }) => (noPadding ? '0' : theme.spacing[4])};
  }
`;
