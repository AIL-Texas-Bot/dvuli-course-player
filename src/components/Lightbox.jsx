import { useState } from 'react'

export default function Lightbox({ src, onClose }) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
      <img
        className="lightbox-img"
        src={src}
        alt="Enlarged infographic"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}
