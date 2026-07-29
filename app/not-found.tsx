import Link from "next/link";
export default function NotFound() {
  return <section className="hero"><p className="eyebrow">404</p><h1>This route is not part of the current graph.</h1><p><Link href="/">Return home</Link></p></section>;
}
