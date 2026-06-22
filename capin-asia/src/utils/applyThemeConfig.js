import themeConfig from "../theme.config.js";

/** Apply theme.config.js tokens to CSS custom properties at runtime. */
export function applyThemeConfig() {
  const root = document.documentElement;
  const { colors, radius, fontFamily, sidebarWidth } = themeConfig;

  if (colors?.primary) root.style.setProperty("--primary", colors.primary);
  if (colors?.secondary) root.style.setProperty("--secondary", colors.secondary);
  if (colors?.success) root.style.setProperty("--success", colors.success);
  if (colors?.warning) root.style.setProperty("--warning", colors.warning);
  if (colors?.danger) root.style.setProperty("--error", colors.danger);
  if (colors?.info) root.style.setProperty("--info", colors.info);

  if (radius?.md) root.style.setProperty("--radius", radius.md);
  if (radius?.sm) root.style.setProperty("--radius-sm", radius.sm);
  if (radius?.lg) root.style.setProperty("--radius-lg", radius.lg);
  if (fontFamily) root.style.setProperty("--font-sans", fontFamily);
  if (sidebarWidth) root.style.setProperty("--sidebar-width", sidebarWidth);
}
