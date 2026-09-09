const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const styles = {
    primary:
      'bg-[#FF7800] text-white hover:bg-[#e56c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7800]',
    secondary:
      'border border-[#0B1F33] text-[#0B1F33] bg-white hover:bg-[#F4F6F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F33]',
    dark:
      'bg-[#0B1F33] text-white hover:bg-[#142f4d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F33]',
  }

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
