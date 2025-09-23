<template>
    <div>
      <p v-if="loading">Loading...</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const route = useRoute();
  
  const shortenedId = String(route.params.shortened_id || ""); // Access the dynamic parameter
  const loading = ref(true); // Flag for loading state
  const errorMessage = ref(""); // Placeholder for error message

  const redirect = async () => {
    try {
      loading.value = true; // Set loading indicator
      console.log('shortenedId<<<<< ' , shortenedId);

      // Try to resolve from a client-side cache first (localStorage)
      const cacheKey = 'shortener_cache_v1';
      const raw = localStorage.getItem(cacheKey);
      let cache: Record<string, string> | null = null;
      if (raw) {
        try {
          cache = JSON.parse(raw);
        } catch (e) {
          cache = null;
        }
      }

      if (cache && cache[shortenedId]) {
        // use location.replace to avoid polluting history and it's marginally faster
        window.location.replace(cache[shortenedId]);
        return;
      }

      // fallback to network
      const response = await axios.get(`https://url-shortener-qnn7.onrender.com/api/v1/${shortenedId}`); // Adjust API endpoint path

      const originalUrl = response.data?.data?.original_url;
      if (!originalUrl) {
        throw new Error('Original URL not found');
      }

      // update cache for future lookups (bounded to avoid unbounded growth)
      try {
        cache = cache || {};
        cache[shortenedId] = originalUrl;
        // limit cache size to latest 500 entries
        const entries = Object.entries(cache);
        if (entries.length > 500) {
          const trimmed = entries.slice(-500);
          cache = Object.fromEntries(trimmed);
        }
        localStorage.setItem(cacheKey, JSON.stringify(cache));
      } catch (e) {
        // ignore cache write failures
        console.warn('Failed to write redirect cache', e);
      }

      // Use replace for slightly better UX during redirects
      window.location.replace(originalUrl);
    } catch (error) {
      console.error("Error fetching original URL:", error);
      errorMessage.value = "Failed to redirect. Please try again later.";
    } finally {
      loading.value = false; // Hide loading indicator
    }
  };

  onMounted(redirect); // Call the redirect function on component mount
  </script>