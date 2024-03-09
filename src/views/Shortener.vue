<!-- src/views/Shortener.vue -->
<template>
    <div>
      <router-link to="/login">Go to Login</router-link>
      <router-link to="/Signup">Go to sign up</router-link>
      <h2>URL Shortener</h2>
  
      <!-- Input form for URL customization -->
      <form @submit.prevent="shortenUrl">
        <label for="url">Enter URL:</label>
        <input
          type="url"
          id="url"
          v-model="originalUrl"
          placeholder="https://example.com"
          required
        />
  
        <label for="customUrl">Custom URL:</label>
        <input
          type="text"
          id="customUrl"
          v-model="customUrl"
          placeholder="Custom URL (optional)"
        />
  
        <button type="submit">Shorten</button>
      </form>
  
      <!-- Display shortened links -->
      <div v-if="shortenedLinks.length > 0">
        <h3>Your Shortened Links</h3>
        <ul>
          <li v-for="link in shortenedLinks" :key="link.shortened_url">
            <span>{{ link.originalUrl }}</span>
            <span>{{ link.shortened_url }}</span>
            <button @click="copyToClipboard(link.shortened_url)">Copy</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { auth, db } from '../firebase';
  import { collection, addDoc } from "firebase/firestore"; 
  // import { getFirestore } from 'firebase/firestore';
  
  const originalUrl = ref<string>('');
  const customUrl = ref<string>('');
  const shortenedLinks = ref<Array<{ originalUrl: string; shortened_url: string }>>([]);
  
  const shortenUrl = async () => {
    if (!originalUrl.value.trim()) {
      alert('Please enter a valid URL');
      return;
    }
  
    try {
      // Add logic to customize URL with custom domain
      const shortenedUrl = customUrl.value || (await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl.value)}`)).data;
  
      // Save the shortened link to Firebase
    await db.firestore().collection('shortenedLinks').add({
        userId: auth.currentUser?.uid,
        originalUrl: originalUrl.value,
        shortened_url: shortenedUrl,
      });
  
      // Update the local list of shortened links
      shortenedLinks.value.unshift({
        originalUrl: originalUrl.value,
        shortened_url: shortenedUrl,
      });
  
      // Clear input fields
      originalUrl.value = '';
      customUrl.value = '';
    } catch (error) {
      console.error('Error shortening URL:', error);
      alert('Error shortening URL. Please try again.');
    }

    addDoc(collection(db, 'your-collection'), {
    // Document data
  })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    });
  };
  </script>
  
  <style scoped>
  /* Add your styles for hover and focus states here */
  </style>
  