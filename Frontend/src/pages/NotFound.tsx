import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

// SEO fix: this SPA always returns HTTP 200 for any URL (the host rewrites every
// request to index.html so React Router can handle routing client-side). That means
// a genuinely broken/typo'd URL still gets a 200 status from the server, which is
// exactly what Google Search Console flags as a "Soft 404" (content that looks like
// an error page but wasn't served with a real 404/410 status). Since we can't easily
// return a true HTTP 404 from static hosting for arbitrary client routes, the
// documented fallback is to explicitly tell crawlers not to index this page with a
// noindex directive, so Google stops trying to treat it as indexable content.
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found | Academy of Tech Masters</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;