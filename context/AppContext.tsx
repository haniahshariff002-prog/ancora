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

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  text: string;
}

export interface SwapConversation {
  id: string;
  swapId?: string;
  itemId?: string;
  itemName: string;
  itemImage: string;
  itemCredits: number;
  lenderId: string;
  lenderName: string;
  lenderAvatar: string;
  lenderLocation: string;
  claimerId: string;
  claimerName: string;
  status: 'Coordinating Meetup' | 'Courier Scheduled' | 'Handoff Completed';
  messages: ChatMessage[];
}

interface AppContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  items: FashionItem[];
  bag: FashionItem[];
  swaps: SwapOrder[];
  creditHistory: CreditTransaction[];
  reviews: Record<string, UserReview[]>;
  conversations: SwapConversation[];
  activeConversation: SwapConversation | null;
  savedItemIds: string[];
  activeCat: string;
  searchQuery: string;
  selectedItem: FashionItem | null;
  isBagOpen: boolean;
  isProfileOpen: boolean;
  isListItemOpen: boolean;
  isAdminOpen: boolean;
  isChatOpen: boolean;
  setActiveCat: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedItem: (item: FashionItem | null) => void;
  setIsBagOpen: (open: boolean) => void;
  setIsProfileOpen: (open: boolean) => void;
  setIsListItemOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setActiveConversation: (conv: SwapConversation | null) => void;
  toggleSaveItem: (itemId: string) => void;
  isItemSaved: (itemId: string) => boolean;
  openChatForSwap: (item: FashionItem, swapId?: string) => void;
  sendChatMessage: (conversationId: string, text: string) => void;
  addToBag: (item: FashionItem) => { success: boolean; message: string };
  removeFromBag: (itemId: string) => void;
  clearBag: () => void;
  checkoutSwap: (address: string) => { success: boolean; message: string; swapOrder?: SwapOrder };
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

  // Chat Conversations State
  const [conversations, setConversations] = useState<SwapConversation[]>([
    {
      id: 'conv-swap-901',
      swapId: 'swap-901',
      itemId: SEEDED_ITEMS[0].id,
      itemName: SEEDED_ITEMS[0].name,
      itemImage: SEEDED_ITEMS[0].img,
      itemCredits: SEEDED_ITEMS[0].credits,
      lenderId: 'user-matteo',
      lenderName: 'Matteo Rossi',
      lenderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      lenderLocation: 'Navigli, Milan',
      claimerId: 'user-chiara',
      claimerName: 'Chiara Moretti',
      status: 'Coordinating Meetup',
      messages: [
        {
          id: 'm-1',
          senderId: 'user-chiara',
          senderName: 'Chiara Moretti',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          timestamp: 'Yesterday, 18:32',
          text: 'Ciao Matteo! I just claimed the oversized blazer using my swap credits. Are you free for an in-person handoff near Piazza del Carmine in Brera?'
        },
        {
          id: 'm-2',
          senderId: 'user-matteo',
          senderName: 'Matteo Rossi',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
          timestamp: 'Yesterday, 18:40',
          text: 'Ciao Chiara! Yes, absolutely. I work near Brera until 17:30 tomorrow. We can meet outside the cafe or I can drop it in the InPost locker if you are in a rush!'
        }
      ]
    }
  ]);
  const [activeConversation, setActiveConversation] = useState<SwapConversation | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [savedItemIds, setSavedItemIds] = useState<string[]>(['w-2', 'm-1', 'a-1']);

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

      const savedConvs = localStorage.getItem('ancora_conversations');
      if (savedConvs) setConversations(JSON.parse(savedConvs));

      const savedLikes = localStorage.getItem('ancora_saved');
      if (savedLikes) setSavedItemIds(JSON.parse(savedLikes));
    } catch (e) {
      console.warn('LocalStorage unavailable or empty');
    }
  }, []);

  const persistState = (
    newItems = items,
    newUsers = users,
    newBag = bag,
    newSwaps = swaps,
    newHistory = creditHistory,
    newConvs = conversations,
    newSaved = savedItemIds
  ) => {
    try {
      localStorage.setItem('ancora_items', JSON.stringify(newItems));
      localStorage.setItem('ancora_users', JSON.stringify(newUsers));
      localStorage.setItem('ancora_bag', JSON.stringify(newBag));
      localStorage.setItem('ancora_swaps', JSON.stringify(newSwaps));
      localStorage.setItem('ancora_history', JSON.stringify(newHistory));
      localStorage.setItem('ancora_conversations', JSON.stringify(newConvs));
      localStorage.setItem('ancora_saved', JSON.stringify(newSaved));
    } catch (e) {
      // Ignore
    }
  };

  const toggleSaveItem = (itemId: string) => {
    setSavedItemIds((prev) => {
      const updated = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      persistState(items, users, bag, swaps, creditHistory, conversations, updated);
      return updated;
    });
  };

  const isItemSaved = (itemId: string) => savedItemIds.includes(itemId);

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  // Open or initialize a swap chat thread
  const openChatForSwap = (item: FashionItem, swapId?: string) => {
    // Find existing conversation for this item or lender
    let existing = conversations.find(
      (c) => (c.itemId === item.id || (swapId && c.swapId === swapId)) && c.claimerId === currentUser.id
    );

    if (!existing) {
      existing = {
        id: `conv-${Date.now()}`,
        swapId: swapId || `swap-${Date.now().toString().slice(-4)}`,
        itemId: item.id,
        itemName: item.name,
        itemImage: item.img,
        itemCredits: item.credits,
        lenderId: item.lenderId,
        lenderName: item.lenderName,
        lenderAvatar: item.lenderAvatar,
        lenderLocation: item.lenderLocation,
        claimerId: currentUser.id,
        claimerName: currentUser.name,
        status: 'Coordinating Meetup',
        messages: [
          {
            id: `msg-${Date.now()}-intro`,
            senderId: item.lenderId,
            senderName: item.lenderName,
            senderAvatar: item.lenderAvatar,
            timestamp: 'Just now',
            text: `Ciao ${currentUser.name.split(' ')[0]}! Thanks for connecting about ${item.name}. Would you like to arrange an in-person meetup in Milan or shall I send it via InPost courier?`
          }
        ]
      };
      const updatedConvs = [existing, ...conversations];
      setConversations(updatedConvs);
      persistState(items, users, bag, swaps, creditHistory, updatedConvs);
    }

    setActiveConversation(existing);
    setIsChatOpen(true);
  };

  // Send a chat message with simulated lender replies
  const sendChatMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: 'Just now',
      text: text.trim()
    };

    const targetConv = conversations.find((c) => c.id === conversationId);
    if (!targetConv) return;

    const updatedConv: SwapConversation = {
      ...targetConv,
      messages: [...targetConv.messages, newMessage]
    };

    const updatedConvs = conversations.map((c) => (c.id === conversationId ? updatedConv : c));
    setConversations(updatedConvs);
    setActiveConversation(updatedConv);
    persistState(items, users, bag, swaps, creditHistory, updatedConvs);

    // Simulated responsive reply from the lender
    const otherParticipantId =
      currentUser.id === targetConv.lenderId ? targetConv.claimerId : targetConv.lenderId;
    const otherParticipantName =
      currentUser.id === targetConv.lenderId ? targetConv.claimerName : targetConv.lenderName;
    const otherParticipantAvatar =
      currentUser.id === targetConv.lenderId
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
        : targetConv.lenderAvatar;

    setTimeout(() => {
      let replyText = 'Perfetto! That works great for me. See you there!';
      const tLower = text.toLowerCase();
      if (tLower.includes('meet') || tLower.includes('brera') || tLower.includes('navigli') || tLower.includes('garibaldi')) {
        replyText = `Sounds good! Let's meet there. I'll have the piece freshly packed and sanitized. Text me when you're nearby! ✨`;
      } else if (tLower.includes('courier') || tLower.includes('inpost') || tLower.includes('ship')) {
        replyText = `Great! I will drop it off at the InPost locker today and send you the tracking code here. 📦`;
      } else if (tLower.includes('fit') || tLower.includes('size')) {
        replyText = `The fit is true to size with a relaxed contemporary drape. You're going to love it!`;
      }

      const autoReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: otherParticipantId,
        senderName: otherParticipantName,
        senderAvatar: otherParticipantAvatar,
        timestamp: 'Just now',
        text: replyText
      };

      setConversations((prev) => {
        const latestConvs = prev.map((c) =>
          c.id === conversationId ? { ...c, messages: [...c.messages, autoReply] } : c
        );
        persistState(items, users, bag, swaps, creditHistory, latestConvs);
        return latestConvs;
      });

      setActiveConversation((prev) =>
        prev && prev.id === conversationId ? { ...prev, messages: [...prev.messages, autoReply] } : prev
      );
    }, 900);
  };

  const addToBag = (item: FashionItem): { success: boolean; message: string } => {
    if (bag.some((i) => i.id === item.id)) {
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
    const updatedBag = bag.filter((i) => i.id !== itemId);
    setBag(updatedBag);
    persistState(items, users, updatedBag);
  };

  const clearBag = () => {
    setBag([]);
    persistState(items, users, []);
  };

  const checkoutSwap = (address: string): { success: boolean; message: string; swapOrder?: SwapOrder } => {
    const totalCredits = bag.reduce((sum, item) => sum + item.credits, 0);
    if (currentUser.credits < totalCredits) {
      return {
        success: false,
        message: `Insufficient credits! You need ${totalCredits} cr, but have ${currentUser.credits} cr. List some unworn pieces to earn credits!`
      };
    }

    // Deduct credits from current user
    const updatedUser = { ...currentUser, credits: currentUser.credits - totalCredits };
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
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

    // Auto-create chat channels with the lenders of claimed items
    let newConvs = [...conversations];
    bag.forEach((claimedItem) => {
      const conv: SwapConversation = {
        id: `conv-order-${newSwap.id}-${claimedItem.id}`,
        swapId: newSwap.id,
        itemId: claimedItem.id,
        itemName: claimedItem.name,
        itemImage: claimedItem.img,
        itemCredits: claimedItem.credits,
        lenderId: claimedItem.lenderId,
        lenderName: claimedItem.lenderName,
        lenderAvatar: claimedItem.lenderAvatar,
        lenderLocation: claimedItem.lenderLocation,
        claimerId: currentUser.id,
        claimerName: currentUser.name,
        status: 'Coordinating Meetup',
        messages: [
          {
            id: `msg-${Date.now()}-initial`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            timestamp: 'Just now',
            text: `Ciao ${claimedItem.lenderName.split(' ')[0]}! I just claimed your "${claimedItem.name}" on Ancora. Where shall we meet in Milan or do you prefer courier delivery?`
          }
        ]
      };
      newConvs = [conv, ...newConvs];
    });
    setConversations(newConvs);

    // Record credit transactions
    const newTxs: CreditTransaction[] = bag.map((item) => ({
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
    const bagIds = bag.map((b) => b.id);
    const updatedItems: FashionItem[] = items.map((item) =>
      bagIds.includes(item.id) ? { ...item, status: 'swapped' as const } : item
    );
    setItems(updatedItems);

    setBag([]);
    persistState(updatedItems, updatedUsers, [], updatedSwaps, updatedHistory, newConvs);

    return {
      success: true,
      message: `Swap confirmed! ${totalCredits} credits used. Meetup chat channel opened with lender.`,
      swapOrder: newSwap
    };
  };

  const addNewItem = (
    itemData: Omit<FashionItem, 'id' | 'lenderId' | 'lenderName' | 'lenderAvatar' | 'lenderLocation' | 'lenderRating' | 'status'>
  ) => {
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

    const bonusCredits = 10;
    const updatedUser = {
      ...currentUser,
      credits: currentUser.credits + bonusCredits,
      swapsCompleted: currentUser.swapsCompleted + 1
    };
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
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

    persistState(updatedItems, updatedUsers, bag, swaps, updatedHistory, conversations);
  };

  // Admin Actions
  const adminAdjustCredits = (userId: string, amount: number, reason: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, credits: Math.max(0, u.credits + amount) };
      }
      return u;
    });
    setUsers(updatedUsers);
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, credits: Math.max(0, prev.credits + amount) }));
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
    persistState(items, updatedUsers, bag, swaps, updatedHistory, conversations);
  };

  const adminUpdateItemStatus = (itemId: string, status: 'available' | 'reserved' | 'swapped') => {
    const updatedItems = items.map((item) => (item.id === itemId ? { ...item, status } : item));
    setItems(updatedItems);
    persistState(updatedItems, users, bag, swaps, creditHistory, conversations);
  };

  const adminDeleteItem = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    const updatedBag = bag.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    setBag(updatedBag);
    persistState(updatedItems, users, updatedBag, swaps, creditHistory, conversations);
  };

  const adminUpdateSwapStatus = (swapId: string, status: SwapOrder['status']) => {
    const updatedSwaps = swaps.map((s) => (s.id === swapId ? { ...s, status } : s));
    setSwaps(updatedSwaps);
    persistState(items, users, bag, updatedSwaps, creditHistory, conversations);
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
        conversations,
        activeConversation,
        savedItemIds,
        activeCat,
        searchQuery,
        selectedItem,
        isBagOpen,
        isProfileOpen,
        isListItemOpen,
        isAdminOpen,
        isChatOpen,
        setActiveCat,
        setSearchQuery,
        setSelectedItem,
        setIsBagOpen,
        setIsProfileOpen,
        setIsListItemOpen,
        setIsAdminOpen,
        setIsChatOpen,
        setActiveConversation,
        toggleSaveItem,
        isItemSaved,
        openChatForSwap,
        sendChatMessage,
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
