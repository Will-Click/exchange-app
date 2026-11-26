import { Apps, Bus, Home, Info, Phone, Snow } from "@/components/icons";

const ICONS: Record<string, React.ReactNode> = { bus: <Bus />, snow: <Snow />, phone: <Phone />, apps: <Apps />, home: <Home /> };

export const guideIcon = (name: string) => ICONS[name] ?? <Info />;
