export const PdfKnifeLogo = ({ size = 44, className = "" }: { size?: number, className?: string, iconColor?: string, partColor?: string }) => (
  <img
    src="./assets/logo.jpg"
    alt="PDF Knife Logo"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
)