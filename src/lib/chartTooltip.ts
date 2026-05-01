// Shared Recharts <Tooltip /> styles aligned with the KHDA palette.
// Apply via: <Tooltip contentStyle={tooltipContentStyle} ... />

export const tooltipContentStyle: React.CSSProperties = {
  fontSize: "11px",
  borderRadius: "8px",
  border: "none",
  background: "hsl(var(--primary))",
  color: "hsl(var(--primary-foreground))",
  padding: "8px 10px",
  boxShadow: "0 4px 12px hsl(var(--primary) / 0.25)",
};

export const tooltipItemStyle: React.CSSProperties = {
  color: "hsl(var(--primary-foreground))",
};

export const tooltipLabelStyle: React.CSSProperties = {
  color: "hsl(var(--primary-foreground))",
  fontWeight: 600,
};
