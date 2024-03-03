import { create } from "zustand";

export type Host = {
  username: string;
  name?: string;
  homeDir: string;
  host: string;
  avatar?: string;
  ip: string;
};

export type Job = {
  jobId: string;
  host: Host;
  file: string;
  finished: boolean;
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

  jobs: Job[];
  addJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  updateProgress: (
    jobId: string,
    sent: number,
    total: number,
    percentage: number
  ) => void;
  completeJob: (jobId: string) => void;

  finishedScan: boolean;
  setFinishedScan: (finishedScan: boolean) => void;
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

  jobs: [],
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  removeJob: (jobId) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.jobId !== jobId),
    })),
  updateProgress: (jobId, sent, total, percentage) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.jobId === jobId ? { ...job, sent, total, percentage } : job
      ),
    })),
  completeJob: (jobId) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.jobId === jobId ? { ...job, finished: true } : job
      ),
    })),

  finishedScan: false,
  setFinishedScan: (finishedScan) => set({ finishedScan }),
}));
