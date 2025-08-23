import { CategoryTabs } from "./categoryTabs";
import { PostTabs } from "./postTabs.types";

export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  category: CategoryTabs;
  hide_from_chat: boolean;
  expires_at: string | null;
  locked: boolean;
  created_at: string;
  connection_type: ConnectionLevel | null;
  connection_degree: ConnectionLevel
  keyword_summary: string[];
  user_interested: boolean
  user_accepted: boolean
  mutual_count: number;
  has_chat: boolean;
  image_url: string | null;
}

export interface PaginatedPostsResponse {
  posts: Post[];
  pagination: { 
    currentPage: number;
    limit: number;
    hasMore: boolean;
    totalFetched: number;
    isUpToDate: boolean;
    nextPage?: number;
  };
}

export interface PostInput {
  user_id: string
  content: string;
  category: CategoryTabs;
  hide_from_chat: boolean;
  connectiontype: ConnectionLevel | null;
  image_url?: string | null;
}

export enum ConnectionLevel {
  You = '0',
  First = '1',
  Second = '2',
  Third = '3',
}

export enum AllowedConnectionLevel {
  First = '1',
  Second = '2',
  Third = '3',
}


export interface PostComponentProps {
  // Base props
  defaultTab?: CategoryTabs;
  postTabs?: PostTabs
  isModal?: boolean;
  visible?: boolean;
  setDidPost?: (state: boolean) => void
  onClose?: (didPost?: boolean) => void;
  defaultConnectionLevel?: ConnectionLevel;

}

export interface CategorySelectorProps {
  activeTab: CategoryTabs;
  onTabPress: (tab: CategoryTabs) => void;
}

export interface ConnectionSelectorProps {
  activeConnectionLevel: ConnectionLevel;
  onConnectionLevelChange: (level: ConnectionLevel) => void;
}