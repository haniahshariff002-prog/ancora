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
  itemOriginalPrice?: number;
  itemResalePrice?: number;
  itemSellerPrice?: number;
  itemSize?: string;
  itemCondition?: string;
  itemBrand?: string;
  lenderId: string;
  lenderName: string;
  lenderAvatar: string;
  lenderLocation: string;
  claimerId: string;
  claimerName: string;
  claimerAvatar?: string;
  status: 'Active' | 'Unread' | 'Coordinating Meetup' | 'Courier Scheduled' | 'Handoff Completed' | 'Declined';
  isUnread?: boolean;
  isShortlisted?: boolean;
  isArchived?: boolean;
  lastUpdated?: string;
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
  toggleShortlistConversation: (convId: string) => void;
  toggleArchiveConversation: (convId: string) => void;
  markConversationRead: (convId: string) => void;
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

  // Chat Conversations State - seeded with realistic Milanese fashion exchange threads
  const [conversations, setConversations] = useState<SwapConversation[]>([
    {
      id: 'conv-swap-901',
      swapId: 'swap-901',
      itemId: 'w-1',
      itemName: 'The Oversized Wool Blazer',
      itemImage: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80',
      itemCredits: 45,
      itemOriginalPrice: 150,
      itemResalePrice: 70,
      itemSellerPrice: 55,
      itemSize: 'M',
      itemCondition: 'Like new',
      itemBrand: 'Max Mara Studio',
      lenderId: 'user-matteo',
      lenderName: 'Matteo Rossi',
      lenderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      lenderLocation: 'Via Brera 12, Milan',
      claimerId: 'user-chiara',
      claimerName: 'Chiara Moretti',
      claimerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      status: 'Coordinating Meetup',
      isUnread: true,
      isShortlisted: true,
      isArchived: false,
      lastUpdated: 'Today, 18:40',
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
          timestamp: 'Today, 18:40',
          text: 'Ciao Chiara! Yes, absolutely. I work near Brera until 17:30 tomorrow. We can meet outside the cafe or I can drop it in the InPost locker if you are in a rush!'
        }
      ]
    },
    {
      id: 'conv-swap-902',
      swapId: 'swap-902',
      itemId: 'w-3',
      itemName: 'Pleated Palazzo Trousers',
      itemImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80',
      itemCredits: 38,
      itemOriginalPrice: 120,
      itemResalePrice: 60,
      itemSellerPrice: 45,
      itemSize: 'IT 40',
      itemCondition: 'Like new',
      itemBrand: 'COS Archive',
      lenderId: 'user-sofia',
      lenderName: 'Sofia Vismara',
      lenderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      lenderLocation: 'Via Isola Garibaldi 4, Milan',
      claimerId: 'user-chiara',
      claimerName: 'Chiara Moretti',
      claimerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      status: 'Courier Scheduled',
      isUnread: true,
      isShortlisted: false,
      isArchived: false,
      lastUpdated: 'Yesterday, 14:15',
      messages: [
        {
          id: 'm-3',
          senderId: 'user-chiara',
          senderName: 'Chiara Moretti',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          timestamp: '2 days ago',
          text: 'Ciao Sofia! Sent 38 credits for the palazzo trousers. Would an InPost locker work?'
        },
        {
          id: 'm-4',
          senderId: 'user-sofia',
          senderName: 'Sofia Vismara',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
          timestamp: 'Yesterday, 14:15',
          text: 'The locker PIN for InPost #412 at Garibaldi has been generated! You can pick it up anytime within 48 hours.'
        }
      ]
    },
    {
      id: 'conv-swap-903',
      swapId: 'swap-903',
      itemId: 'w-2',
      itemName: 'Silk Bias Slip Dress',
      itemImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
      itemCredits: 42,
      itemOriginalPrice: 130,
      itemResalePrice: 65,
      itemSellerPrice: 50,
      itemSize: 'S',
      itemCondition: 'Mint condition',
      itemBrand: 'Sandro Paris',
      lenderId: 'user-alessandro',
      lenderName: 'Alessandro',
      lenderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      lenderLocation: 'Via Felice Casati, Milan',
      claimerId: 'user-chiara',
      claimerName: 'Chiara Moretti',
      claimerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      status: 'Declined',
      isUnread: true,
      isShortlisted: false,
      isArchived: false,
      lastUpdated: '06 Nov 2026',
      messages: [
        {
          id: 'm-5',
          senderId: 'user-alessandro',
          senderName: 'Alessandro',
          senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
          timestamp: '06 Nov 2026',
          text: 'Ancora System: This piece was claimed by another Milan member right before. Our advice? Check other available fits or save it to your wishlist!'
        }
      ]
    },
    {
      id: 'conv-swap-904',
      swapId: 'swap-904',
      itemId: 'm-6',
      itemName: 'Vintage Leather Flight Bomber',
      itemImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
      itemCredits: 65,
      itemOriginalPrice: 220,
      itemResalePrice: 110,
      itemSellerPrice: 80,
      itemSize: 'L',
      itemCondition: 'Vintage',
      itemBrand: 'Avirex Vintage',
      lenderId: 'user-marco',
      lenderName: 'Marco Bellini',
      lenderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
      lenderLocation: 'Via Privata San Martiniano, Milan',
      claimerId: 'user-chiara',
      claimerName: 'Chiara Moretti',
      claimerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      status: 'Active',
      isUnread: false,
      isShortlisted: true,
      isArchived: false,
      lastUpdated: '05 Nov 2026',
      messages: [
        {
          id: 'm-6',
          senderId: 'user-marco',
          senderName: 'Marco Bellini',
          senderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
          timestamp: '05 Nov 2026',
          text: 'Good morning! Thank you for your message and interest. The leather is thoroughly conditioned and ready for handoff in Navigli.'
        }
      ]
    },
    {
      id: 'conv-swap-905',
      swapId: 'swap-905',
      itemId: 'w-5',
      itemName: 'Double-Breasted Trench Coat',
      itemImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      itemCredits: 55,
      itemOriginalPrice: 190,
      itemResalePrice: 90,
      itemSellerPrice: 70,
      itemSize: 'M',
      itemCondition: 'Vintage',
      itemBrand: 'Burberry Archive',
      lenderId: 'user-chiara',
      lenderName: 'Chiara Moretti',
      lenderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      lenderLocation: 'Brera, Milan',
      claimerId: 'user-giulia',
      claimerName: 'Giulia De Luca',
      claimerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      status: 'Handoff Completed',
      isUnread: false,
      isShortlisted: false,
      isArchived: false,
      lastUpdated: '02 Nov 2026',
      messages: [
        {
          id: 'm-7',
          senderId: 'user-giulia',
          senderName: 'Giulia De Luca',
          senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
          timestamp: '02 Nov 2026',
          text: 'The coat is incredible! Fits like a dream. Thank you so much Chiara!'
        },
        {
          id: 'm-8',
          senderId: 'user-chiara',
          senderName: 'Chiara Moretti',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          timestamp: '02 Nov 2026',
          text: 'So happy it found a wonderful second life with you in Milan! Enjoy!'
        }
      ]
    },
    {
      id: 'conv-swap-906',
      swapId: 'swap-906',
      itemId: 'w-4',
      itemName: 'Chunky Cashmere Mockneck',
      itemImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      itemCredits: 48,
      itemOriginalPrice: 160,
      itemResalePrice: 80,
      itemSellerPrice: 60,
      itemSize: 'L',
      itemCondition: 'Gently loved',
      itemBrand: 'Loro Piana Vintage',
      lenderId: 'user-nina',
      lenderName: 'Nina',
      lenderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      lenderLocation: 'Via Privata San Martiniano, Milan',
      claimerId: 'user-chiara',
      claimerName: 'Chiara Moretti',
      claimerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      status: 'Declined',
      isUnread: false,
      isShortlisted: false,
      isArchived: true,
      lastUpdated: '01 Nov 2026',
      messages: [
        {
          id: 'm-9',
          senderId: 'user-nina',
          senderName: 'Nina',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          timestamp: '01 Nov 2026',
          text: 'Good morning Hasnayn, thank you for your message and interest! Unfortunately the piece has already been reserved for another swapper.'
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

  const toggleShortlistConversation = (convId: string) => {
    const updated = conversations.map((c) =>
      c.id === convId ? { ...c, isShortlisted: !c.isShortlisted } : c
    );
    setConversations(updated);
    if (activeConversation?.id === convId) {
      setActiveConversation({ ...activeConversation, isShortlisted: !activeConversation.isShortlisted });
    }
    persistState(items, users, bag, swaps, creditHistory, updated);
  };

  const toggleArchiveConversation = (convId: string) => {
    const updated = conversations.map((c) =>
      c.id === convId ? { ...c, isArchived: !c.isArchived } : c
    );
    setConversations(updated);
    if (activeConversation?.id === convId) {
      setActiveConversation({ ...activeConversation, isArchived: !activeConversation.isArchived });
    }
    persistState(items, users, bag, swaps, creditHistory, updated);
  };

  const markConversationRead = (convId: string) => {
    const updated = conversations.map((c) =>
      c.id === convId ? { ...c, isUnread: false } : c
    );
    setConversations(updated);
    if (activeConversation?.id === convId) {
      setActiveConversation({ ...activeConversation, isUnread: false });
    }
    persistState(items, users, bag, swaps, creditHistory, updated);
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
        toggleShortlistConversation,
        toggleArchiveConversation,
        markConversationRead,
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
