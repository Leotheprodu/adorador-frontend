export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('adorador_theme') || 'light';
        let resolvedTheme = theme;
        
        if (theme === 'system') {
          resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        if (resolvedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
