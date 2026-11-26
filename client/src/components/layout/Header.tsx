import type { JSX } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { PlusIcon } from '@/components/common/icons';
import { Logo } from '@/components/common/Logo';
import { NavigationItems, type NavigationItem } from '@/constants/navigation';
import { Language } from '@/enums';
import { usePreferences } from '@/hooks/usePreferences';
import { useTranslation } from '@/hooks/useTranslation';
import { Paths } from '@/routes/paths';
import '@/components/layout/Header.css';

interface HeaderProps {
  onNewGame: () => void;
}

export const Header = ({ onNewGame }: HeaderProps): JSX.Element => {
  const { updatePreferences } = usePreferences();
  const { translate, language } = useTranslation();

  return (
    <header className="top">
      <Link to={Paths.home} className="brand">
        <Logo />
        <div>
          <div className="brand-name">GO DOJO</div>
          <div className="brand-tag">{translate('tagline')}</div>
        </div>
      </Link>

      <nav className="nav" aria-label="Main">
        {NavigationItems.map((item: NavigationItem): JSX.Element => (
          <NavLink key={item.path} to={item.path} end>
            {translate(item.labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="top-actions">
        <div className="seg" role="group" aria-label={translate('language')}>
          <button
            type="button"
            aria-pressed={language === Language.Thai}
            onClick={(): void => updatePreferences({ language: Language.Thai })}
          >
            TH
          </button>
          <button
            type="button"
            aria-pressed={language === Language.English}
            onClick={(): void => updatePreferences({ language: Language.English })}
          >
            EN
          </button>
        </div>

        <Button variant="primary" onClick={onNewGame}>
          <PlusIcon />
          {translate('newGame')}
        </Button>
      </div>
    </header>
  );
};
