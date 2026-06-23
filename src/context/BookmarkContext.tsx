import { createContext, useContext, type ReactNode } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import type { GitHubUser } from '../types';

interface BookmarkContextType {
  bookmarks: GitHubUser[];
  addBookmark: (user: GitHubUser) => void;
  removeBookmark: (login: string) => void;
  isBookmarked: (login: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useLocalStorage<GitHubUser[]>('devboard-bookmarks', []);

  const addBookmark = (user: GitHubUser) => {
    setBookmarks([...bookmarks, user]);
  };

  const removeBookmark = (login: string) => {
    setBookmarks(bookmarks.filter((b) => b.login !== login));
  };

  const isBookmarked = (login: string) => {
    return bookmarks.some((b) => b.login === login);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used inside BookmarkProvider');
  return context;
}