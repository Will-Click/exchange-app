import { At, Phone } from "@/components/icons";

const CHIP_TONES = ["bg-[#E3F6F4] text-[#0F5E56]", "bg-[#E8ECFF] text-[#25389A]", "bg-[#FFE6DF] text-[#9A3418]", "bg-[#FFF1D0] text-[#7A5300]"];

export type CardPerson = {
  display_name: string;
  subtitle: string;
  interests: string[];
  social_handle?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  color: string;
};

export function ProfileCard({ person, emptyContact = "Nothing shared yet. Members can still reply to your posts.", footer }: {
  person: CardPerson;
  emptyContact?: string;
  footer?: React.ReactNode;
}) {
  const hasContact = person.social_handle || person.contact_email || person.phone;
  return (
    <article className="card overflow-hidden">
      <div className="relative h-[84px] overflow-hidden"><img src="/photos/banff.jpg" alt="" aria-hidden="true" className="block h-full w-full object-cover" /></div>
      <div className="relative -mt-[30px] flex flex-col gap-3 px-[22px] pb-[22px]">
        <span className="grid h-16 w-16 place-items-center rounded-full text-2xl font-bold text-navy shadow-[0_0_0_4px_#fff]" style={{ background: person.color }} aria-hidden="true">
          {(person.display_name || "?").slice(0, 1).toUpperCase()}
        </span>
        <div className="flex flex-col gap-0.5">
          <h3 className="h text-2xl font-bold">{person.display_name || "Your name"}</h3>
          <span className="text-sm text-muted">{person.subtitle}</span>
        </div>
        {person.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {person.interests.map((i, n) => <span key={i} className={`chip ${CHIP_TONES[n % CHIP_TONES.length]}`}>{i}</span>)}
          </div>
        )}
        <div className="flex flex-col gap-2 border-t border-line pt-3">
          <span className="tag">Shared contact</span>
          {person.social_handle && <span className="flex items-center gap-2.5 text-[15px] font-semibold"><At size={18} />{person.social_handle}</span>}
          {person.contact_email && <a href={`mailto:${person.contact_email}`} className="text-[15px] font-semibold">{person.contact_email}</a>}
          {person.phone && <span className="flex items-center gap-2.5 text-[15px] font-semibold"><Phone size={18} />{person.phone}</span>}
          {!hasContact && <span className="text-sm text-muted">{emptyContact}</span>}
        </div>
        {footer}
      </div>
    </article>
  );
}
