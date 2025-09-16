export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description?: string;
  badge?: string | number;
  isActive?: boolean;
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: string;
  userId: string;
  createdAt: Date;
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  category?: string;
}

export interface UserMenuItem {
  label: string;
  href?: string;
  icon: any;
  action?: () => void;
  divider?: boolean;
}