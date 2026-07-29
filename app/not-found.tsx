import Link from "next/link";
export default function NotFound() { return <section className="not-found page-shell page-top"><p className="eyebrow">404 / Unknown node</p><h1>This route is not part of the current graph.</h1><p>The project may have moved, changed ownership, or never existed here.</p><Link className="button primary" href="/">Return to Ordivon</Link></section>; }
