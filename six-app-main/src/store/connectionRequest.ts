import { create } from 'zustand';
import { ConnectionRequest } from '../service/request.service';

interface ConnectionRequestStore {
  requests: ConnectionRequest[];
  setRequests: (requests: ConnectionRequest[]) => void;
  clearRequests: () => void;
}

export const useConnectionRequestStore = create<ConnectionRequestStore>()(
    (set) => ({
      requests: [],
      setRequests: (requests) => set({ requests }),
      clearRequests: () => set({ requests: [] }),
    })
);