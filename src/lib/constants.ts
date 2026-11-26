export const INTERESTS = [
  { id: "hiking", label: "Hiking" },
  { id: "skiing", label: "Skiing" },
  { id: "sports", label: "Sports" },
  { id: "music", label: "Music" },
  { id: "food", label: "Food" },
  { id: "nightlife", label: "Nightlife" },
  { id: "arts", label: "Arts & culture" },
  { id: "volunteering", label: "Volunteering" },
] as const;

export const interestLabel = (id: string) => INTERESTS.find((i) => i.id === id)?.label ?? id;

// Launch scope: only students travelling from Germany for now.
export const COUNTRIES = ["Germany"];

export const MAJORS = ["Business", "Computer Science", "Engineering", "Kinesiology", "Psychology", "Economics", "Biology", "Law"];

export const HOUSING = [
  { value: "on_campus", label: "On campus confirmed" },
  { value: "off_campus", label: "Off campus confirmed" },
  { value: "looking", label: "Still looking" },
  { value: "unsure", label: "Unsure" },
] as const;

export const CATEGORY_STYLE = {
  university: { label: "University", chip: "bg-[#E8ECFF] text-[#25389A]", bar: "#3C5BD6", ev: "bg-[#E8ECFF] text-[#25389A] shadow-[inset_3px_0_0_#3C5BD6]" },
  city: { label: "Calgary", chip: "bg-[#FFE6DF] text-[#9A3418]", bar: "#FF6A4D", ev: "bg-[#FFE6DF] text-[#9A3418] shadow-[inset_3px_0_0_#FF6A4D]" },
  rockies: { label: "Rocky Mountains", chip: "bg-[#E3F6F4] text-[#0F5E56]", bar: "#1E9E92", ev: "bg-[#E3F6F4] text-[#0F5E56] shadow-[inset_3px_0_0_#1E9E92]" },
} as const;

export const AVATAR_COLORS = ["#2EC4B6", "#FFC93C", "#FF8A70", "#CDEBFF", "#E8ECFF", "#FFF1D0"];
export function avatarColor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export const TZ = "America/Edmonton";
