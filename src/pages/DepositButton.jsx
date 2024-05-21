export default function DepositButton({
  onDeposit,
  isDisabled,
  text,
  className,
}) {
  return (
    <div
      className={`pixel2 px-6 py-0 custom-heading text-[36px] ${isDisabled ? "cursor-none" : ""} ${className}`}
      onClick={onDeposit}
    >
      {text}
    </div>
  );
}
