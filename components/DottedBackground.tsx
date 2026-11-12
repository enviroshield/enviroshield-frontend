export default function DottedBackground({
  className = "",
  withGlow = true,
}: {
  className?: string;
  withGlow?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,51,78,0.14)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      {withGlow && (
        <>
          <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[#016edc]/10 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full bg-[#9bcfff]/25 blur-3xl" />
        </>
      )}
    </div>
  );
}
