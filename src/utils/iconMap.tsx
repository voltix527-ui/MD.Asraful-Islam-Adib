import {
  Atom,
  Bot,
  Braces,
  Briefcase,
  Code2,
  Compass,
  Cpu,
  Film,
  Globe,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  MonitorSmartphone,
  Palette,
  PenTool,
  ShieldCheck,
  Terminal,
  Wand2,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  bot: Bot,
  wand: Wand2,
  workflow: Workflow,
  terminal: Terminal,
  code: Code2,
  layers: Layers,
  braces: Braces,
  atom: Atom,
  shield: ShieldCheck,
  monitor: MonitorSmartphone,
  pen: PenTool,
  image: ImageIcon,
  film: Film,
  compass: Compass,
  globe: Globe,
  layout: LayoutTemplate,
  palette: Palette,
  briefcase: Briefcase,
};

export function getPortfolioIcon(key: string): LucideIcon {
  return ICON_MAP[key] || Cpu;
}
