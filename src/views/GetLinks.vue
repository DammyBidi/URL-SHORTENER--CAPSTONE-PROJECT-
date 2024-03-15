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
  
  const shortenedId = route.params.shortened_id; // Access the dynamic parameter
  const loading = ref(true); // Flag for loading state
  const errorMessage = ref(""); // Placeholder for error message
  
  const redirect = async () => {
    try {
      loading.value = true; // Set loading indicator
      console.log('shortenedId<<<<< ' , shortenedId);
      const response = await axios.get(`https://url-shortener-qnn7.onrender.com/api/v1/${shortenedId}`); // Adjust API endpoint path
  
      console.log("Response: " + response.data["data"]["original_url"]);
      const originalUrl = response.data["data"]["original_url"]
      window.location.href = originalUrl;
    } catch (error) {
      console.error("Error fetching original URL:", error);
      errorMessage.value = "Failed to redirect. Please try again later.";
    } finally {
      loading.value = false; // Hide loading indicator
    }
  };
  
  onMounted(redirect); // Call the redirect function on component mount
  </script>