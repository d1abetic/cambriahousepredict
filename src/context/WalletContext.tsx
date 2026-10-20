import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  House,
  Prediction,
  SortCriteria,
  ToastNotification,
  MarketChamber,
  RegionalCity,
  FreebornUpsetOption,
  MarketPrediction,
} from '@/types';
import {
  mockHouses,
  CHARTER_REVEALED_COUNTS,
  REGIONAL_CITIES,
  FREEBORN_UPSET_OPTIONS,
} from '@/data/mockHouses';

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

  // Concept A: Multi-Chamber Market State
  activeChamber: MarketChamber;
  setActiveChamber: (chamber: MarketChamber) => void;
  regionalCities: RegionalCity[];
  selectedCityId: string;
  setSelectedCityId: (id: string) => void;
  selectedCity: RegionalCity;
  freebornOptions: FreebornUpsetOption[];
  allPredictions: MarketPrediction[];
  submitRegionalPrediction: (cityId: string, houseId: string, amount: number) => boolean;
  submitFreebornPrediction: (optionId: string, amount: number) => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userSilverBalance, setUserSilverBalance] = useState<number>(250000);
  const [userPrediction, setUserPrediction] = useState<Prediction | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [houses, setHouses] = useState<House[]>(() =>
    mockHouses.map((h) => ({
      ...h,
      silver: 0,
      totalRevealed: CHARTER_REVEALED_COUNTS[h.id] ?? h.totalRevealed ?? 0,
    }))
  );

  // Multi-Chamber State
  const [activeChamber, setActiveChamber] = useState<MarketChamber>('crown');
  const [regionalCities, setRegionalCities] = useState<RegionalCity[]>(REGIONAL_CITIES);
  const [selectedCityId, setSelectedCityId] = useState<string>('dreadfort');
  const [freebornOptions, setFreebornOptions] = useState<FreebornUpsetOption[]>(FREEBORN_UPSET_OPTIONS);
  const [allPredictions, setAllPredictions] = useState<MarketPrediction[]>([]);

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

  // Chamber 1: Imperial Crown Main Prediction
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
      showToast('Notice: You already backed a House for the Imperial Crown.', 'info');
      return false;
    }

    const targetHouse = houses.find((h) => h.id === houseId);
    if (!targetHouse) {
      showToast('Error: Target house not found.', 'error');
      return false;
    }

    // Deduct silver balance
    setUserSilverBalance((prev) => prev - amount);
    setUserPrediction({ houseId, amount, timestamp: Date.now() });

    const newMarketPred: MarketPrediction = {
      id: `crown-${Date.now()}`,
      chamber: 'crown',
      targetId: houseId,
      targetName: `House ${targetHouse.name}`,
      chamberTitle: 'Imperial Crown · Capital City',
      amount,
      multiplier: 2.25,
      potentialPayout: Math.round(amount * 2.25),
      timestamp: Date.now(),
    };
    setAllPredictions((prev) => [newMarketPred, ...prev]);

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
      `Imperial Crown: Burned ${amount.toLocaleString()} Silver for House ${targetHouse.name}!`,
      'success'
    );

    closeHouseModal();
    return true;
  };

  // Chamber 2: Regional City Turf Wars Prediction
  const submitRegionalPrediction = (cityId: string, houseId: string, amount: number): boolean => {
    if (isNaN(amount) || amount < 20000 || amount > 1000000) {
      showToast('Error: Prediction must be between 20,000 and 1,000,000 Silver.', 'error');
      return false;
    }

    if (amount > userSilverBalance) {
      showToast('Error: Insufficient Silver balance in your wallet.', 'error');
      return false;
    }

    const targetCity = regionalCities.find((c) => c.id === cityId);
    const targetHouse = houses.find((h) => h.id === houseId);

    if (!targetCity || !targetHouse) {
      showToast('Error: Target city or house not found.', 'error');
      return false;
    }

    setUserSilverBalance((prev) => prev - amount);

    // Calculate dynamic regional odds multiplier based on current city influence
    const currentEntry = targetCity.influenceBreakdown.find((b) => b.houseId === houseId);
    const currPct = currentEntry ? currentEntry.percentage : 15;
    const dynamicMultiplier = Number(Math.max(1.4, Math.min(6.0, (100 / currPct) * 0.9)).toFixed(2));

    const newMarketPred: MarketPrediction = {
      id: `reg-${cityId}-${Date.now()}`,
      chamber: 'regional',
      targetId: `${cityId}:${houseId}`,
      targetName: `${targetCity.name} · House ${targetHouse.name}`,
      chamberTitle: `Regional War: ${targetCity.name}`,
      amount,
      multiplier: dynamicMultiplier,
      potentialPayout: Math.round(amount * dynamicMultiplier),
      timestamp: Date.now(),
    };
    setAllPredictions((prev) => [newMarketPred, ...prev]);

    // Update city influence breakdown and total silver
    setRegionalCities((prevCities) =>
      prevCities.map((c) => {
        if (c.id !== cityId) return c;
        const newTotal = c.totalSilverBurned + amount;
        const existing = c.influenceBreakdown.find((b) => b.houseId === houseId);
        let updatedBreakdown = [...c.influenceBreakdown];

        if (existing) {
          updatedBreakdown = updatedBreakdown.map((b) =>
            b.houseId === houseId
              ? { ...b, silverBurned: b.silverBurned + amount }
              : b
          );
        } else {
          updatedBreakdown.push({
            houseId,
            houseName: targetHouse.name,
            silverBurned: amount,
            percentage: 0,
          });
        }

        // Recalculate percentages
        const sumSilver = updatedBreakdown.reduce((acc, curr) => acc + curr.silverBurned, 0);
        updatedBreakdown = updatedBreakdown.map((b) => ({
          ...b,
          percentage: Math.round((b.silverBurned / sumSilver) * 100),
        }));

        // Sort descending
        updatedBreakdown.sort((a, b) => b.silverBurned - a.silverBurned);

        return {
          ...c,
          totalSilverBurned: newTotal,
          leadingHouseId: updatedBreakdown[0].houseId,
          influenceBreakdown: updatedBreakdown,
        };
      })
    );

    showToast(
      `Regional War: Burned ${amount.toLocaleString()} Silver for House ${targetHouse.name} to seize ${targetCity.name}!`,
      'success'
    );

    return true;
  };

  // Chamber 3: Freeborn Disruption Prediction
  const submitFreebornPrediction = (optionId: string, amount: number): boolean => {
    if (isNaN(amount) || amount < 20000 || amount > 1000000) {
      showToast('Error: Prediction must be between 20,000 and 1,000,000 Silver.', 'error');
      return false;
    }

    if (amount > userSilverBalance) {
      showToast('Error: Insufficient Silver balance in your wallet.', 'error');
      return false;
    }

    const targetOption = freebornOptions.find((o) => o.id === optionId);
    if (!targetOption) {
      showToast('Error: Freeborn option not found.', 'error');
      return false;
    }

    setUserSilverBalance((prev) => prev - amount);

    const newMarketPred: MarketPrediction = {
      id: `freeborn-${Date.now()}`,
      chamber: 'freeborn',
      targetId: optionId,
      targetName: targetOption.title,
      chamberTitle: 'Freeborn Disruption Pool',
      amount,
      multiplier: targetOption.multiplier,
      potentialPayout: Math.round(amount * targetOption.multiplier),
      timestamp: Date.now(),
    };
    setAllPredictions((prev) => [newMarketPred, ...prev]);

    setFreebornOptions((prev) =>
      prev.map((o) =>
        o.id === optionId
          ? { ...o, totalSilverBurned: o.totalSilverBurned + amount }
          : o
      )
    );

    showToast(
      `Freeborn Disruption: Burned ${amount.toLocaleString()} Silver on "${targetOption.title}" (${targetOption.multiplier}x)!`,
      'success'
    );

    return true;
  };

  const selectedCity =
    regionalCities.find((c) => c.id === selectedCityId) || regionalCities[0];

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

        // Concept A
        activeChamber,
        setActiveChamber,
        regionalCities,
        selectedCityId,
        setSelectedCityId,
        selectedCity,
        freebornOptions,
        allPredictions,
        submitRegionalPrediction,
        submitFreebornPrediction,
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
