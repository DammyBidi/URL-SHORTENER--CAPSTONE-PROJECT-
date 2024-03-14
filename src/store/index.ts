// src/store/index.ts
import { createStore } from 'vuex';

export default createStore({
  state: {
    shortenedLinks: [],
  },
  mutations: {
    setShortenedLinks(state, links) {
      state.shortenedLinks = links;
    },
    addShortenedLink(state, link) {
      state.shortenedLinks.unshift(link);
    },
  },
});
