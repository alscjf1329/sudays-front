interface MobileBottomBarProps {
  bottomOffset: number;
  onImageClick: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function MobileBottomBar({
  bottomOffset,
  onImageClick,
  onSubmit,
  isLoading
}: MobileBottomBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-[var(--background-secondary)] border-t border-[var(--border)] md:hidden"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={onImageClick}
          className="p-2 rounded-full hover:bg-[var(--hover)]"
          disabled={isLoading}
        >
          <svg
            className="w-6 h-6 text-[var(--muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          className="px-4 py-2 text-[var(--primary)] bg-[var(--highlight-secondary)] rounded-lg font-medium hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </div>
  );
} 