export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bannerUrl?: string;
  subscribersCount: number;
  verified: boolean;
  bio?: string;
  joinedDate?: string;
}

export interface Comment {
  id: string;
  videoId: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string; // e.g., "14:20"
  durationSeconds: number;
  views: number;
  uploadedAt: string;
  channel: Channel;
  category: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  comments?: Comment[];
  tags?: string[];
}
