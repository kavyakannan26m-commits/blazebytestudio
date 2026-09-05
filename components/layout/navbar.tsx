import Link from 'next/link';
export function Navbar() {
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl"><div className="container flex h-16 items-center justify-between">
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300 text-slate-950">B</span><span>BlazeByte <span className="text-cyan-300">Studio</span></span></Link>
    <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex"><Link href="/courses">Courses</Link><Link href="/about">About</Link><Link href="/why-us">Why Us</Link><Link href="/contact">Contact</Link></nav>
    <div className="flex items-center gap-2"><Link href="/login" className="hidden rounded-xl px-4 py-2 text-sm text-slate-300 sm:block">Log in</Link><Link href="/courses" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">Explore</Link></div>
  </div></header>
}
