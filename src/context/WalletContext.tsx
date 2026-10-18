import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { House, Prediction, SortCriteria, ToastNotification } from '@/types';
import { mockHouses, CHARTER_REVEALED_COUNTS } from '@/data/mockHouses';

interface WalletContextType {
  userSilverBalance: number;
  userPrediction: Prediction | null;
  selectedHouse: House | null;
  houses: House[];
  sortedHouses: House[];
  toasts: ToastNotification[];
  walletAddress: string;
  isConnected: boolean;
  sortCriteria: SortCriteria;
  setSortCriteria: (criteria: SortCriteria) => void;
  setSelectedHouse: (house: House | null) => void;
  openHouseModal: (houseId: string) => void;
  closeHouseModal: () => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  submitPrediction: (houseId: string, amount: number) => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userSilverBalance, setUserSilverBalance] = useState<number>(150000);
  const [userPrediction, setUserPrediction] = useState<Prediction | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [houses, setHouses] = useState<House[]>(() =>
    mockHouses.map((h) => ({
      ...h,
      silver: 0,
      totalRevealed: CHARTER_REVEALED_COUNTS[h.id] ?? h.totalRevealed ?? 0,
    }))
  );

  useEffect(() => {
    setHouses(
      mockHouses.map((h) => ({
        ...h,
        silver: 0,
        totalRevealed: CHARTER_REVEALED_COUNTS[h.id] ?? h.totalRevealed ?? 0,
      }))
    );
  }, []);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('silver');
  const [walletAddress, setWalletAddress] = useState<string>('0x71C...39aE');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const connectWallet = () => {
    if (!isConnected) {
      setIsConnected(true);
      setWalletAddress('0x71C...39aE');
      showToast('Wallet connected: 0x71C...39aE (Network: Cambria Mainnet)', 'success');
    } else {
      showToast('Wallet already connected: 0x71C...39aE (Network: Cambria Mainnet)', 'info');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    showToast('Wallet disconnected', 'info');
  };

  const openHouseModal = (houseId: string) => {
    const house = houses.find((h) => h.id === houseId);
    if (house) {
      setSelectedHouse(house);
    }
  };

  const closeHouseModal = () => {
    setSelectedHouse(null);
  };

  const submitPrediction = (houseId: string, amount: number): boolean => {
    if (isNaN(amount) || amount < 20000 || amount > 1000000) {
      showToast('Error: Prediction must be between 20,000 and 1,000,000 Silver.', 'error');
      return false;
    }

    if (amount > userSilverBalance) {
      showToast('Error: Insufficient Silver balance in your wallet.', 'error');
      return false;
    }

    if (userPrediction) {
      showToast('Error: You have already made your prediction for this round.', 'error');
      return false;
    }

    const targetHouse = houses.find((h) => h.id === houseId);
    if (!targetHouse) {
      showToast('Error: Target house not found.', 'error');
      return false;
    }

    // Deduct silver balance & set prediction
    setUserSilverBalance((prev) => prev - amount);
    setUserPrediction({ houseId, amount, timestamp: Date.now() });

    // Update house stats
    setHouses((prevHouses) =>
      prevHouses.map((h) =>
        h.id === houseId
          ? {
              ...h,
              silver: h.silver + amount,
              players: h.players + 1,
            }
          : h
      )
    );

    showToast(
      `Successfully burned ${amount.toLocaleString()} Silver for House ${targetHouse.name}! Prediction locked.`,
      'success'
    );

    closeHouseModal();
    return true;
  };

  const sortedHouses = [...houses].sort((a, b) => {
    if (sortCriteria === 'silver') return b.silver - a.silver;
    if (sortCriteria === 'players') {
      const bRevealed = CHARTER_REVEALED_COUNTS[b.id] ?? b.totalRevealed ?? 0;
      const aRevealed = CHARTER_REVEALED_COUNTS[a.id] ?? a.totalRevealed ?? 0;
      return bRevealed - aRevealed;
    }
    if (sortCriteria === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <WalletContext.Provider
      value={{
        userSilverBalance,
        userPrediction,
        selectedHouse,
        houses,
        sortedHouses,
        toasts,
        walletAddress,
        isConnected,
        sortCriteria,
        setSortCriteria,
        setSelectedHouse,
        openHouseModal,
        closeHouseModal,
        connectWallet,
        disconnectWallet,
        showToast,
        removeToast,
        submitPrediction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
