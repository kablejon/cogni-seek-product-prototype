interface SectionTitleProps {
  title: string
  subtitle?: string
  icon?: string
  align?: 'left' | 'center'
}

export function SectionTitle({ 
  title, 
  subtitle, 
  icon,
  align = 'center' 
}: SectionTitleProps) {
  return (
    <div className={`space-y-2 ${align === 'center' ? 'text-center' : ''}`}>
      {icon && (
        <span className="text-3xl">{icon}</span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}















