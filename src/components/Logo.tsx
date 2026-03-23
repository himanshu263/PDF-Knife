export const PdfKnifeLogo = ({ size = 24, className = "" }: { size?: number, className?: string, iconColor?: string, partColor?: string }) => (
  <img 
    src="./icons/logo.jpg" 
    alt="PDF Knife Logo"
    width={size} 
    height={size} 
    className={className}
    style={{ objectFit: 'contain' }}
  />
)