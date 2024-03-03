import { create } from "zustand";

export type Host = {
  username: string;
  name?: string;
  homeDir: string;
  host: string;
  avatar?: string;
  ip: string;
};

export type Progress = {
  sent: number;
  total: number;
  percentage: number;
};

interface StoreState {
  user: Host;
  setUser: (user: Host) => void;
  updateIp: (ip: string) => void;

  hosts: Host[];
  addHost: (host: Host) => void;
  clear: () => void;

  finishedScan: boolean;
  setFinishedScan: (finishedScan: boolean) => void;

  selectedFile: string | null;
  setSelectedFile: (selectedFile: string | null) => void;

  progress: Progress;
  setProgress: (progress: Progress) => void;
}

export const store = create<StoreState>()((set) => ({
  user: {
    username: "",
    homeDir: "",
    host: "",
    ip: "",
  },
  setUser: (user) => set({ user }),
  updateIp: (ip) => set((state) => ({ user: { ...state.user, ip } })),

  hosts: [],
  addHost: (host) => set((state) => ({ hosts: [...state.hosts, host] })),
  clear: () => set({ hosts: [] }),

  finishedScan: false,
  setFinishedScan: (finishedScan) => set({ finishedScan }),

  selectedFile: null,
  setSelectedFile: (selectedFile) => set({ selectedFile }),

  progress: {
    sent: 0,
    total: 0,
    percentage: 0,
  },

  setProgress: (progress) => set({ progress }),
}));
