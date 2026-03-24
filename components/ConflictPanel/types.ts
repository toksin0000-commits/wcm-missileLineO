export interface Weapon {
  name: string;
  image?: string;
  description?: string;
  range?: string;
  speed?: string;
  warhead?: string;
  year?: string;
  status?: string;
  price?: string;
}

export interface ConflictData {
  id: string;
  name: string;
  summary_short: string;
  summary_long: string;
  timeline: any[];
  humanitarian: {
    refugees: number;
    idps: number;
    civilian_casualties: number;
  };
  arsenal?: {
    country: string;
    categories: {
      [key: string]: Weapon[];
    };
  }[];
}

export interface ConflictPanelProps {
  conflictId: string | null;
  onClose: () => void;
  isOpen: boolean;
}