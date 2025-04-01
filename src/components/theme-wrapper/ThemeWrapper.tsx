import { ReactNode, useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme/ThemeContextDef';

const ThemeWrapper = ({ children }: { children: ReactNode }) => {
  const themeContext = useContext(ThemeContext);
  return (
    <>
      <div
        className={`${themeContext?.color.background} absolute top-0 h-full w-full`}
      >
        {children}
      </div>
    </>
  );
};

export default ThemeWrapper;
