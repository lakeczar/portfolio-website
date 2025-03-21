import { ReactNode, useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme/ThemeContextDef';

const ThemeWrapper = ({ children }: { children: ReactNode }) => {
  const themeContext = useContext(ThemeContext);
  return (
    <>
      <div
        className={`${themeContext?.color.background}`}
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default ThemeWrapper;
