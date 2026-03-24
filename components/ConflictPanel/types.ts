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
      [key: string]: string[];
    };
  }[];
}

export interface ConflictPanelProps {
  conflictId: string | null;
  onClose: () => void;
  isOpen: boolean;
}