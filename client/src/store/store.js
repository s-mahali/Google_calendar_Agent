import { create } from "zustand";

const useStore = create((set) => ({
  chatMessages: [
    {
      role: "ai",
      content:
        "Hello, Good Morning! How can I help with your calendar today ?☺️",
    },
  ],

  sessions: [],

  addMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  setChatMessages: (messages) => set({ chatMessages: messages }),
  setSessions: (sessions) => set({ sessions: sessions }),
  clearChat: () =>
    set({
      chatMessages: [
        {
          role: "ai",
          content: "New chat started. How can I assist you?",
        },
      ],
    }),
}));

export default useStore;
