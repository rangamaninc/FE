/** Footer — global application footer. */
export default function Footer() {
  return (
    <footer className="mt-8 border-t border-border py-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} CapinAsia. All rights reserved.
    </footer>
  );
}
