import { useState } from 'react'
import Lightbox from './Lightbox'

export default function InfographicBlock({ block }) {
  const [open, setOpen] = useState(false)

  // Support both new static file path (imageSrc) and old embedded data URI (imageDataUri)
  const src = block.imageSrc || block.imageDataUri
  if (!src) return null

  return (
    <>
      <div className="infographic-block" onClick={() => setOpen(true)} title="Click to zoom">
        <img src={src} alt={block.title || 'Infographic'} loading="lazy" />
      </div>
      {open && <Lightbox src={src} onClose={() => setOpen(false)} />}
    </>
  )
}

