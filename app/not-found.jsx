import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="notfound">
      <span className="section-caption">FORM / DEMO</span>
      <h1>This page is not here.</h1>
      <p>Return to the fictional request workspace to keep exploring.</p>
      <Link href="/" className="btn btn-primary">
        Back to the form
      </Link>
      <p lang="ar" dir="rtl">
        هذه الصفحة غير موجودة. عد إلى النموذج التجريبي.
      </p>
    </main>
  );
}
