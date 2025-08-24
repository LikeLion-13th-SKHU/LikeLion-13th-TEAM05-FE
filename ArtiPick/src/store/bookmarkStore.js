import { create } from "zustand";

export const useBookmarkStore = create((set, get) => ({
  bookmarkedIds: [], // 북마크된 문화행사 ID 배열

  setBookmarkedIds: (ids) => set({ bookmarkedIds: ids }),

  addBookmark: (id) =>
    set((state) => ({
      bookmarkedIds: [...state.bookmarkedIds, id],
    })),

  removeBookmark: (id) =>
    set((state) => ({
      bookmarkedIds: state.bookmarkedIds.filter((i) => i !== id),
    })),
}));
