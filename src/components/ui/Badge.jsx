import React from 'react'

function Badge({ children, variant = 'yellow', className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  )
}

export default Badge