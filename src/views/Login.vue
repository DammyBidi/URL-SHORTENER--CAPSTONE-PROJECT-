<!-- src/views/Login.vue -->
<template>
  <div class="main">
    <div class="left">
      <h3>Shortly</h3>
      <div class="text">
        <h2>Login</h2>
        <p>
          Don't have an account? <span> <router-link to="/Signup">Sign up</router-link> </span> 
        </p>
        <button class="provider-btn" @click="loginWithGoogle">
          <img
            class="google-btn-logo"
            src="../assets/images/google.png"
            alt=""
          />
          Login with Google
        </button>
        <div>
          <div class="line"></div>
          <p>OR</p>
          <div class="line"></div>
        </div>
        <form @submit.prevent="loginUser">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />

          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />

          <button class="login-btn" type="submit">Login</button>
        </form>
        <p>
          By logging in with an account, you agree to shortly's Terms of
          Service, Privacy Policy and Acceptable Use Policy.
        </p>
      </div>
    </div>
    <div class="right">
      <div class="image">
        <div class="img-div">
          <img src="../assets/images/login-illustration.jpg" alt="login" />
        </div>
        <h3>
          Easily analyze links and QR codes just as effortlessly as you create
          them
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRouter } from "vue-router";

const email = ref<string>("");
const password = ref<string>("");
const router = useRouter();

const loginUser = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    // Redirect to dashboard after successful login
    router.push("/dashboard");
  } catch (error) {
    console.error("Error logging in:", error as any);
  }
};

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // Redirect to dashboard after successful login
    router.push("/dashboard");
  } catch (error) {
    console.error("Error logging in with Google:", error as any);
  }
};
</script>

<style scoped>
@import "../assets/styles/login.css";
</style>
../utils/firebase