export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  userId: string;
  createdAt: Date;
}

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  requiredRole?: string[];
  children?: NavigationItem[];
}