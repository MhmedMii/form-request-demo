export default function BrandFooter({ text }) {
  return (
    <footer className="foot-note">
      <span>{text.footerNote}</span>
      <a href="https://github.com/MhmedMii" target="_blank" rel="noreferrer">
        MhmedMii <span aria-hidden="true">↗</span>
      </a>
    </footer>
  );
}
