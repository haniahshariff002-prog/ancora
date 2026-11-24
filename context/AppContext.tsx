'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FashionItem, SEEDED_ITEMS } from '../data/items';
import { UserProfile, UserReview, SEEDED_USERS, SEEDED_REVIEWS } from '../data/users';

export interface SwapOrder {
  id: string;
  items: FashionItem[];
  totalCredits: number;
  date: string;
  status: 'Requested' | 'Approved' | 'Dispatched' | 'Delivered' | 'Completed';
  userId: string;
  userName: string;
  userEmail: string;
  deliveryAddress: string;
  trackingNumber?: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  date: string;
  description: string;
  amount: number;
  type: 'earned' | 'spent';
}

interface AppContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  items: FashionItem[];
  bag: FashionItem[];
  swaps: SwapOrder[];
  creditHistory: CreditTransaction[];
  reviews: Record<string, UserReview[]>;
  activeCat: string;
  searchQuery: string;
  selectedItem: FashionItem | null;
  isBagOpen: boolean;
  isProfileOpen: boolean;
  isListItemOpen: boolean;
  isAdminOpen: boolean;
  setActiveCat: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedItem: (item: FashionItem | null) => void;
  setIsBagOpen: (open: boolean) => void;
  setIsProfileOpen: (open: boolean) => void;
  setIsListItemOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  addToBag: (item: FashionItem) => { success: boolean; message: string };
  removeFromBag: (itemId: string) => void;
  clearBag: () => void;
  checkoutSwap: (address: string) => { success: boolean; message: string };
  addNewItem: (item: Omit<FashionItem, 'id' | 'lenderId' | 'lenderName' | 'lenderAvatar' | 'lenderLocation' | 'lenderRating' | 'status'>) => void;
  switchUser: (userId: string) => void;
  adminAdjustCredits: (userId: string, amount: number, reason: string) => void;
  adminUpdateItemStatus: (itemId: string, status: 'available' | 'reserved' | 'swapped') => void;
  adminDeleteItem: (itemId: string) => void;
  adminUpdateSwapStatus: (swapId: string, status: SwapOrder['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(SEEDED_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(SEEDED_USERS[0]); // Chiara
  const [items, setItems] = useState<FashionItem[]>(SEEDED_ITEMS);
  const [bag, setBag] = useState<FashionItem[]>([]);
  const [swaps, setSwaps] = useState<SwapOrder[]>([
    {
      id: 'swap-901',
      items: [SEEDED_ITEMS[0]],
      totalCredits: 45,
      date: 'Yesterday, 18:30',
      status: 'Dispatched',
      userId: 'user-chiara',
      userName: 'Chiara Moretti',
      userEmail: 'chiara.moretti@studenti.unimi.it',
      deliveryAddress: 'Via Fiori Chiari 12, Brera, Milan',
      trackingNumber: 'INPOST-IT-98231'
    }
  ]);
  const [creditHistory, setCreditHistory] = useState<CreditTransaction[]>([
    {
      id: 'tx-1',
      userId: 'user-chiara',
      date: '2026-03-20',
      description: 'Lender Reward: Silk Bias Slip Dress claimed',
      amount: 42,
      type: 'earned'
    },
    {
      id: 'tx-2',
      userId: 'user-chiara',
      date: '2026-03-22',
      description: 'Lender Reward: Pleated Palazzo Trousers claimed',
      amount: 38,
      type: 'earned'
    },
    {
      id: 'tx-3',
      userId: 'user-chiara',
      date: '2026-03-24',
      description: 'Welcome Style Grant',
      amount: 60,
      type: 'earned'
    }
  ]);
  const [reviews] = useState<Record<string, UserReview[]>>(SEEDED_REVIEWS);

  const [activeCat, setActiveCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<FashionItem | null>(null);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isListItemOpen, setIsListItemOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Load state from localStorage on browser mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('ancora_items');
      if (savedItems) setItems(JSON.parse(savedItems));

      const savedUsers = localStorage.getItem('ancora_users');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
        setCurrentUser(parsedUsers[0]);
      }

      const savedBag = localStorage.getItem('ancora_bag');
      if (savedBag) setBag(JSON.parse(savedBag));

      const savedSwaps = localStorage.getItem('ancora_swaps');
      if (savedSwaps) setSwaps(JSON.parse(savedSwaps));

      const savedHistory = localStorage.getItem('ancora_history');
      if (savedHistory) setCreditHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.warn('LocalStorage unavailable or empty');
    }
  }, []);

  // Sync state to localStorage
  const persistState = (newItems = items, newUsers = users, newBag = bag, newSwaps = swaps, newHistory = creditHistory) => {
    try {
      localStorage.setItem('ancora_items', JSON.stringify(newItems));
      localStorage.setItem('ancora_users', JSON.stringify(newUsers));
      localStorage.setItem('ancora_bag', JSON.stringify(newBag));
      localStorage.setItem('ancora_swaps', JSON.stringify(newSwaps));
      localStorage.setItem('ancora_history', JSON.stringify(newHistory));
    } catch (e) {
      // Ignore
    }
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const addToBag = (item: FashionItem): { success: boolean; message: string } => {
    if (bag.some(i => i.id === item.id)) {
      return { success: false, message: 'This piece is already in your swap bag.' };
    }
    if (item.lenderId === currentUser.id) {
      return { success: false, message: 'You cannot swap your own listed pieces.' };
    }
    const updatedBag = [...bag, item];
    setBag(updatedBag);
    persistState(items, users, updatedBag);
    return { success: true, message: `Added "${item.name}" to your swap bag!` };
  };

  const removeFromBag = (itemId: string) => {
    const updatedBag = bag.filter(i => i.id !== itemId);
    setBag(updatedBag);
    persistState(items, users, updatedBag);
  };

  const clearBag = () => {
    setBag([]);
    persistState(items, users, []);
  };

  const checkoutSwap = (address: string): { success: boolean; message: string } => {
    const totalCredits = bag.reduce((sum, item) => sum + item.credits, 0);
    if (currentUser.credits < totalCredits) {
      return {
        success: false,
        message: `Insufficient credits! You need ${totalCredits} cr, but have ${currentUser.credits} cr. List some unworn pieces to earn credits!`
      };
    }

    // Deduct credits from current user
    const updatedUser = { ...currentUser, credits: currentUser.credits - totalCredits };
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setCurrentUser(updatedUser);

    // Create swap order
    const newSwap: SwapOrder = {
      id: `swap-${Date.now().toString().slice(-4)}`,
      items: [...bag],
      totalCredits,
      date: 'Just now',
      status: 'Requested',
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      deliveryAddress: address || 'Brera Student Hub, Milan'
    };
    const updatedSwaps = [newSwap, ...swaps];
    setSwaps(updatedSwaps);

    // Record credit transactions
    const newTxs: CreditTransaction[] = bag.map(item => ({
      id: `tx-${Date.now()}-${item.id}`,
      userId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      description: `Swap Claim: ${item.name}`,
      amount: item.credits,
      type: 'spent'
    }));
    const updatedHistory = [...newTxs, ...creditHistory];
    setCreditHistory(updatedHistory);

    // Mark items as reserved/swapped
    const bagIds = bag.map(b => b.id);
    const updatedItems: FashionItem[] = items.map(item =>
      bagIds.includes(item.id) ? { ...item, status: 'swapped' as const } : item
    );
    setItems(updatedItems);

    setBag([]);
    persistState(updatedItems, updatedUsers, [], updatedSwaps, updatedHistory);

    return {
      success: true,
      message: `Swap confirmed! ${totalCredits} credits used. Your pieces are being packaged for handoff.`
    };
  };

  const addNewItem = (itemData: Omit<FashionItem, 'id' | 'lenderId' | 'lenderName' | 'lenderAvatar' | 'lenderLocation' | 'lenderRating' | 'status'>) => {
    const newItem: FashionItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      lenderId: currentUser.id,
      lenderName: currentUser.name,
      lenderAvatar: currentUser.avatar,
      lenderLocation: currentUser.location,
      lenderRating: currentUser.rating,
      status: 'available'
    };

    const updatedItems = [newItem, ...items];
    setItems(updatedItems);

    // Grant provisional listing credits to the user (e.g. +10 credits for adding inventory)
    const bonusCredits = 10;
    const updatedUser = {
      ...currentUser,
      credits: currentUser.credits + bonusCredits,
      swapsCompleted: currentUser.swapsCompleted + 1
    };
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setCurrentUser(updatedUser);

    const bonusTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      description: `Listing Bonus: ${itemData.name}`,
      amount: bonusCredits,
      type: 'earned'
    };
    const updatedHistory = [bonusTx, ...creditHistory];
    setCreditHistory(updatedHistory);

    persistState(updatedItems, updatedUsers, bag, swaps, updatedHistory);
  };

  // Admin Actions
  const adminAdjustCredits = (userId: string, amount: number, reason: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, credits: Math.max(0, u.credits + amount) };
      }
      return u;
    });
    setUsers(updatedUsers);
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, credits: Math.max(0, prev.credits + amount) }));
    }

    const tx: CreditTransaction = {
      id: `tx-adm-${Date.now()}`,
      userId,
      date: new Date().toISOString().split('T')[0],
      description: `Admin Adjustment: ${reason}`,
      amount: Math.abs(amount),
      type: amount >= 0 ? 'earned' : 'spent'
    };
    const updatedHistory = [tx, ...creditHistory];
    setCreditHistory(updatedHistory);
    persistState(items, updatedUsers, bag, swaps, updatedHistory);
  };

  const adminUpdateItemStatus = (itemId: string, status: 'available' | 'reserved' | 'swapped') => {
    const updatedItems = items.map(item => item.id === itemId ? { ...item, status } : item);
    setItems(updatedItems);
    persistState(updatedItems, users, bag, swaps, creditHistory);
  };

  const adminDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    const updatedBag = bag.filter(item => item.id !== itemId);
    setItems(updatedItems);
    setBag(updatedBag);
    persistState(updatedItems, users, updatedBag, swaps, creditHistory);
  };

  const adminUpdateSwapStatus = (swapId: string, status: SwapOrder['status']) => {
    const updatedSwaps = swaps.map(s => s.id === swapId ? { ...s, status } : s);
    setSwaps(updatedSwaps);
    persistState(items, users, bag, updatedSwaps, creditHistory);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        items,
        bag,
        swaps,
        creditHistory,
        reviews,
        activeCat,
        searchQuery,
        selectedItem,
        isBagOpen,
        isProfileOpen,
        isListItemOpen,
        isAdminOpen,
        setActiveCat,
        setSearchQuery,
        setSelectedItem,
        setIsBagOpen,
        setIsProfileOpen,
        setIsListItemOpen,
        setIsAdminOpen,
        addToBag,
        removeFromBag,
        clearBag,
        checkoutSwap,
        addNewItem,
        switchUser,
        adminAdjustCredits,
        adminUpdateItemStatus,
        adminDeleteItem,
        adminUpdateSwapStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
