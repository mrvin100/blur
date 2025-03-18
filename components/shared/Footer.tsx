import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <nav className="flex space-x-6">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-accent-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blur. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 