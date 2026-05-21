import { CheckCircle2 } from "lucide-react";

type CheckListItemProps = {
  children: string;
};

export function CheckListItem({ children }: CheckListItemProps) {
  return (
    <div
      className="flex items-start gap-3 border-t border-charcoal/10 pt-4"
      data-testid="check-list-item"
    >
      <CheckCircle2
        className="mt-1 shrink-0 text-spicy-orange"
        size={20}
        aria-hidden="true"
      />
      <p className="text-base font-extrabold leading-7 text-charcoal">
        {children}
      </p>
    </div>
  );
}
