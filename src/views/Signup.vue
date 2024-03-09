<!-- src/views/Signup.vue -->
<template>
  <div class="main">
    <div class="left">
      <h3>Shortly</h3>
      <div class="text">
        <h2>Create your account</h2>
        <p>
          Already have an account?
          <span> <router-link to="/Login">Login</router-link> </span>
        </p>
        <button class="provider-btn" @click="signUpWithGoogle">
          <img
            class="google-btn-logo"
            src="../assets/images/google.png"
            alt=""
          />
          Sign Up with Google
        </button>
        <div>
          <div class="line"></div>
          <p>OR</p>
          <div class="line"></div>
        </div>

        <form @submit.prevent="signupUser">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />

          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />

          <button class="login-btn" type="submit">Signup</button>
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
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "vue-router";

const email = ref<string>("");
const password = ref<string>("");
const router = useRouter();

const signupUser = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    // Redirect to dashboard after successful signup
    router.push("/dashboard");
  } catch (error) {
    console.error("Error signing up:", error.message);
  }
};

const signUpWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // Redirect to dashboard after successful sign-up
    router.push("/dashboard");
  } catch (error) {
    console.error("Error signing up with Google:", error.message);
  }
};
</script>

<style scoped>
@import "../assets/styles/login.css";
</style>
