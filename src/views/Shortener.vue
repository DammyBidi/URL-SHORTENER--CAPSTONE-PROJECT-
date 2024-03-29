<!-- src/views/Shortener.vue -->
<template>
  <div>
    <nav>
      <div class="links">
        <h3>Shortly</h3>
        <a href="">features</a>
        <a href="">Pricing</a>
        <a href="">Resources</a>
      </div>
      <div class="login">
        <router-link to="/login"> Login</router-link>
        <router-link to="/Signup"><button>Sign Up</button></router-link>
      </div>
      <div class="mobile-nav-toggle" @click="toggleMobileNav">
        <img src="/src/assets/images/menu.png" alt="Menu logo">
      </div>
    </nav>

    <header>
      <!-- Mobile navigation -->
      <div class="mobile-nav" v-if="showMobileNav">
        <div class="mobile-links">
          <a href="">Features</a>
          <a href="">Pricing</a>
          <a href="">Resources</a>
        </div>
        <hr />
        <div class="mobile-login">
          <router-link to="/login"> Login</router-link>
          <router-link to="/Signup"><button>Sign Up</button></router-link>
        </div>
      </div>
      <div class="hero">
        <div class="text">
          <h1>More than just shorter links</h1>
          <p>
            Build your brand's recognition and get detailed insights on how your
            links are performing.
          </p>
          <router-link to="/Signup"><button>Get Started</button></router-link>
        </div>
        <div class="image">
          <img
            src="/src/assets/images/illustration-working.svg"
            alt="illustration of a person working on a computer"
          />
        </div>
      </div>
      <div class="warning"><p>You can only create 02 links here. Signup or login to get the full features of this app</p></div>
      
      <div class="form">
        <form @submit.prevent="shortenUrl">
          <div class="input-container">
            <input
              type="url"
              name="url-input"
              v-model="originalUrl"
              placeholder="Shorten a link here..."
              :class="{ 'error-input': errorMessage }"
              :style="{
                borderColor: errorMessage ? 'hsl(0, 87%, 67%)' : '',
                color: errorMessage ? 'hsl(0, 87%, 67%)' : '',
              }"
            />
            <label v-if="errorMessage" class="error-message" for="url-input">
              <i> {{ errorMessage }} </i>
            </label>
          </div>
          <button type="submit">Shorten It!</button>
        </form>
      </div>
      
    </header>

    <div class="grey-bg">
      <div class="link-section">
        <div v-if="loading">Loading...</div>
        <div v-if="lastTwoShortenedLinks.length > 0">
          <div v-for="(link, index) in lastTwoShortenedLinks" :key="index">
            <div class="link-container">
              <div class="original-link">{{ link.originalUrl }}</div>
              <div class="short-link">
                <span>{{ link.shortened_url }}</span>
                <button
                  @click="copyToClipboard(link.shortened_url, index)"
                  :class="{ 'violet-button': link.copied }"
                >
                  {{ link.copied ? "Copied!" : "Copy" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="statistics">
        <div class="statistics-title">
          <h2>Advanced Statistics</h2>
          <p>
            Track how your links are performing across the web with our advanced
            statistics dashboard.
          </p>
        </div>
        <div class="cards">
          <div class="card c1">
            <div class="card-icon">
              <img
                src="/src/assets//images/icon-brand-recognition.svg"
                alt="brand recognition icon"
              />
            </div>
            <h3>Brand Recognition</h3>
            <p>
              Boost your brand recognition with <br />
              each click. Generic links don't mean a thing. Branded links help
              instil confidence in your content.
            </p>
          </div>
          <div class="card c2">
            <div class="card-icon">
              <img
                src="/src/assets//images/icon-detailed-records.svg"
                alt="detailed records icon"
              />
            </div>
            <h3>Detailed Records</h3>
            <p>
              Gain insights into who is clicking your links. Knowing when and
              where people engage with your content helps inform better
              decisions.
            </p>
          </div>
          <div class="card c3">
            <div class="card-icon">
              <img
                src="/src/assets//images/icon-fully-customizable.svg"
                alt="fully customizable icon"
              />
            </div>
            <h3>Fully Customizable</h3>
            <p>
              Improve brand awareness and <br />
              content discoverability through <br />
              customizable links, supercharging audience engagement.
            </p>
          </div>
          <div class="connect-line"></div>
        </div>
      </div>
    </div>

    <div class="boost">
      <h2>Boost your links today</h2>
      <router-link to="/Signup"><button>Get Started</button></router-link>
    </div>

    <footer-bg />

    <!-- Display loading indicator while submitting the form -->
    <!-- <div v-if="loading">Loading...</div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,  watchEffect } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { auth, db } from "../utils/firebase";
// import { addDoc, collection } from "firebase/firestore";
import footerBg from '../components/footer-bg.vue';
// import { getFirestore } from 'firebase/firestore';





const router = useRouter();
const originalUrl = ref<string>("");
const customUrl = ref<string>("");
const shortenedLinks = ref<
  Array<{ originalUrl: string; shortened_url: string; copied: boolean }>
>([]);
const lastTwoShortenedLinks = ref<Array<{ originalUrl: string; shortened_url: string; copied: boolean }>>([]);
const loading = ref<boolean>(false); // New loading indicator state
const errorMessage = ref<string>("");
const showMobileNav = ref<boolean>(false);
// Store the client URL with the shortened ID in combineUrl 
const combinedUrl = ref<string>("");
const amountOfLinks = ref<number>(0);

// Fetch data from local storage when the component is mounted

const storedLinks = localStorage.getItem("shortenedLinks");
if (storedLinks) {
  shortenedLinks.value = JSON.parse(storedLinks);
}

const storedAmountOfLinks = localStorage.getItem("amountOfLinks");
if (storedAmountOfLinks) {
  amountOfLinks.value = parseInt(storedAmountOfLinks);
}

const updateLastTwoShortenedLinks = () => {
  if (shortenedLinks.value.length > 2) {
    lastTwoShortenedLinks.value = shortenedLinks.value.slice(-2);
  } else {
    lastTwoShortenedLinks.value = shortenedLinks.value;
  }
};


const shortenUrl = async () => {
  errorMessage.value = "";

  if (!originalUrl.value.trim()) {
    errorMessage.value = "Please enter a valid URL";
    return;
  }

  // Set loading to true before starting the asynchronous operation
  

 if(amountOfLinks.value > 2){
   errorMessage.value = "You have reached the maximum amount of links allowed please signup or login to get more links";
   alert("You have reached the maximum amount of links allowed please signup or login to get more links");
   return; 
  }

  amountOfLinks.value += 1;
  loading.value = true;

  try {
    const clientUrl = 's-h.netlify.app';
    const response = await axios.post(
      "https://url-shortener-qnn7.onrender.com/api/v1/shorten",
      { url: originalUrl.value }, 
      {
        headers: {
          "Content-Type": "application/json",
        },
      }

    );
    const shortenedUrl = response.data["data"]["short_id"];

    combinedUrl.value = `${clientUrl}/sh/${shortenedUrl}`;
    // This is the shortened URL that is to be saved to Firebase and visited by the user
    console.log(combinedUrl.value);

   

    // Save the shortened link to Firebase

        // Save the shortened link to Firebase
    //     const userId = auth.currentUser?.uid; // Get the userId from Firebase authentication
    // if (!userId) {
    //   throw new Error("User ID is not available");
    // }

    // const docRef = await addDoc(collection(db, "shortenedLinks"), {
    //   userId: auth.currentUser?.uid,
    //   originalUrl: originalUrl.value,
    //   shortened_url: combinedUrl.value,                     
    // });

    // Update the local list of shortened links
    shortenedLinks.value.unshift({
      originalUrl: originalUrl.value,
      shortened_url: combinedUrl.value,
      copied: false
    });

    // Clear input fields
    originalUrl.value = "";
    customUrl.value = "";
  } catch (error) {
    console.error("Error shortening URL:", error);
    alert("Error shortening URL. Please try again.");
  } finally {
    // Set loading to false after the asynchronous operation completes or encounters an error
    loading.value = false;
  }

  // addDoc(collection(db, "your-collection"), {})
  //   .then((docRef) => {
  //     console.log("Document written with ID: ", docRef.id);
  //   })
  //   .catch((error) => {
  //     console.error("Error adding document: ", error);
  //   });
};

const copyToClipboard = (text: string, index: number) => {
  navigator.clipboard.writeText(text).then(() => {
    // Set the copied state of the link to true
    const index = shortenedLinks.value.findIndex(
      (link) => link.shortened_url === text
    );
    shortenedLinks.value[index].copied = true;

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      shortenedLinks.value[index].copied = false;
    }, 2000);
  }).catch((error) => {
    console.error('Error copying to clipboard:', error);
  });
};

const toggleMobileNav = () => {
  showMobileNav.value = !showMobileNav.value;
};

// Watch for changes in shortenedLinks and update local storage accordingly
watchEffect(() => {
  localStorage.setItem("shortenedLinks", JSON.stringify(shortenedLinks.value));
  localStorage.setItem("amountOfLinks", amountOfLinks.value.toString());
});

watchEffect(updateLastTwoShortenedLinks);
</script>

<style scoped>
@import "../assets/styles/Shortener.css";
</style>
../utils/firebase