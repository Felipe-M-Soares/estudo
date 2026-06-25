export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 text-base-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-mint-400 shadow-[0_0_10px_theme(colors.mint.400)]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-[0_0_10px_theme(colors.amber.400)] [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400 shadow-[0_0_10px_theme(colors.violet.400)] [animation-delay:300ms]" />
      </div>
    </div>
  );
}
