import Link from 'next/link';
import { Moon, Sun, ArrowCounterClockwise } from '@phosphor-icons/react';
export default function TopBar({ text, theme, counter, onToggleLocale, onToggleTheme, onReset }) {
  return (
    <header className="top-bar">
      <Link href="/" className="project-title">
        <strong>
          FORM<span>.</span>
        </strong>
        <span>{text.projectSubtitle}</span>
      </Link>
      <div className="top-actions">
        <span className="demo-chip">{text.demoLabel}</span>
        <button className="chip-btn" onClick={onToggleLocale} aria-label={text.switchLanguage}>
          {text.langButton}
        </button>
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? text.lightMode : text.darkMode}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button className="reset-btn" onClick={onReset}>
          <ArrowCounterClockwise size={16} />
          <span>{text.resetDemo}</span>
        </button>
      </div>
    </header>
  );
}
