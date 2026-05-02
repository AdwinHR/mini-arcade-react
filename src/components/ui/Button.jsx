import React from 'react'

function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = '',
  style = {},
  ariaLabel
}) {
  const baseClass = 'btn'
  const variantClass = `btn-${variant}`
  
  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export default Button