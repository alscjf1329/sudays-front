const Button = ({ content, type, className, onClick }: { content: string, type: 'submit' | 'button', className?: string, onClick?: () => void }) => {
  return (
    <button
      type={type}
      className={className || `w-full flex justify-center items-center p-4 rounded-lg bg-[var(--highlight-secondary)] text-white font-medium hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-highlight`}
      onClick={onClick}
    >
      {content}
    </button>
  )
}

export { Button };