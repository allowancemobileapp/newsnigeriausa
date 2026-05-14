export interface NewsItem {
  id: number;
  category: string;
  subCategory: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  content?: string;
}

export const initialNewsData: NewsItem[] = [
  {
    id: 1,
    category: 'Nigeria News',
    subCategory: 'Politics',
    title: 'Electoral Reform Proposals Gain Traction in National Assembly',
    excerpt: 'Stakeholders advocate for digital integration to enhance transparency in future polls.',
    date: 'May 14, 2026',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    category: 'USA News',
    subCategory: 'Business',
    title: 'New Trade Agreement to Boost Diaspora Investment Channels',
    excerpt: 'The US-Nigeria business council announces new incentives for small and medium enterprises.',
    date: 'May 13, 2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    category: 'Global African Diaspora News',
    subCategory: 'Culture',
    title: 'Pan-African Arts Festival Set to Launch in London Next Month',
    excerpt: 'A celebration of creativity, heritage, and the global African identity across three continents.',
    date: 'May 12, 2026',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    category: 'Nigeria News',
    subCategory: 'Technology',
    title: 'Lagos Tech Hub Becomes a Model for Continental Innovation',
    excerpt: 'Local startups are attracting record-breaking venture capital in the second quarter.',
    date: 'May 11, 2026',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 5,
    category: 'USA News',
    subCategory: 'Social Impact',
    title: 'Diaspora Health Initiative Reaches Milestone in Rural Outreach',
    excerpt: 'Collaborative efforts provide essential medical services to underserved communities.',
    date: 'May 10, 2026',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 6,
    category: 'Global African Diaspora News',
    subCategory: 'Politics',
    title: 'Diaspora Voting Rights Discussed at International Summit',
    excerpt: 'Legal experts and policymakers explore frameworks for inclusive democratic participation.',
    date: 'May 09, 2026',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e443d1fe?auto=format&fit=crop&q=80&w=800'
  }
];
