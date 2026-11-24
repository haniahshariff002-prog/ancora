export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: 'member' | 'admin';
  credits: number;
  location: string;
  avatar: string;
  bio: string;
  rating: number;
  swapsCompleted: number;
  joinedDate: string;
}

export interface UserReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  date: string;
  comment: string;
  itemSwapped: string;
}

export const SEEDED_USERS: UserProfile[] = [
  {
    id: 'user-chiara',
    name: 'Chiara Moretti',
    handle: '@chiara_brera',
    email: 'chiara.moretti@studenti.unimi.it',
    role: 'member',
    credits: 140,
    location: 'Brera, Milan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Fashion communication student at NABA. Loving minimalist tailoring, 90s archive pieces, and oversized outerwear.',
    rating: 4.9,
    swapsCompleted: 24,
    joinedDate: 'October 2025'
  },
  {
    id: 'user-matteo',
    name: 'Matteo Rossi',
    handle: '@matteo_navigli',
    email: 'matteo.rossi@polimi.it',
    role: 'member',
    credits: 65,
    location: 'Navigli, Milan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Product design researcher. Swapping heavy chore jackets, Japanese selvedge denim, and architectural monographs.',
    rating: 5.0,
    swapsCompleted: 12,
    joinedDate: 'December 2025'
  },
  {
    id: 'user-sofia',
    name: 'Sofia Vismara',
    handle: '@sofia_isola',
    email: 'sofia.vismara@studio.it',
    role: 'member',
    credits: 90,
    location: 'Isola, Milan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    bio: 'Freelance stylist. Obsessed with silk slip dresses, vintage leather bags, and timeless Italian jewelry.',
    rating: 4.8,
    swapsCompleted: 19,
    joinedDate: 'November 2025'
  },
  {
    id: 'user-admin',
    name: 'Ancora Admin Studio',
    handle: '@ancora_hq',
    email: 'admin@ancora.fashion',
    role: 'admin',
    credits: 9999,
    location: 'Via Montenapoleone, Milan',
    avatar: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&auto=format&fit=crop&q=80',
    bio: 'Curator & platform operations lead at Ancora Exchange Studio.',
    rating: 5.0,
    swapsCompleted: 250,
    joinedDate: 'September 2025'
  }
];

export const SEEDED_REVIEWS: Record<string, UserReview[]> = {
  'user-chiara': [
    {
      id: 'rev-1',
      reviewerName: 'Matteo Rossi',
      reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      date: '3 days ago',
      comment: 'The oversized wool blazer arrived freshly dry-cleaned and packaged like a luxury order. Beautiful experience!',
      itemSwapped: 'The oversized blazer'
    },
    {
      id: 'rev-2',
      reviewerName: 'Elena Bianchi',
      reviewerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Super fast handoff at Porta Garibaldi. Piece was in even better condition than described.',
      itemSwapped: 'Silk slip dress in pistachio'
    },
    {
      id: 'rev-3',
      reviewerName: 'Luca Ferrari',
      reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      date: '1 month ago',
      comment: 'Effortless swap. Chiara responds in minutes and treats garments with immense care.',
      itemSwapped: 'Cashmere mockneck knit'
    }
  ],
  'user-matteo': [
    {
      id: 'rev-4',
      reviewerName: 'Chiara Moretti',
      reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      date: '1 week ago',
      comment: 'Chore jacket fit true to measurement. A pleasure to swap with Matteo!',
      itemSwapped: 'Structured chore jacket'
    }
  ],
  'user-sofia': [
    {
      id: 'rev-5',
      reviewerName: 'Gulia Conti',
      reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      date: '5 days ago',
      comment: 'Vintage leather bag came wrapped in tissue paper with a lovely handwritten note. Ancora at its best.',
      itemSwapped: 'Vintage structured leather shoulder bag'
    }
  ]
};
