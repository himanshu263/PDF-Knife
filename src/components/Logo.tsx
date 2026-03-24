export const PdfKnifeLogo = ({ size = 113, className = "" }: { size?: number, className?: string, iconColor?: string, partColor?: string }) => (
  <img
    src="./assets/logo.png"
    alt="PDF Knife Logo"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
)