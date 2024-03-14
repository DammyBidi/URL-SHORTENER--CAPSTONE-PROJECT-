<!-- src/views/Dashboard.vue -->
<template>
  <div>
    <nav>
      <div class="nav-logo">
        <h3>Shortly</h3>
      </div>
      <div>
        <p>Welcome Gideon</p>
        <button>Signout</button>
      </div>
    </nav>

    <div class="background-image1">
      <form @submit.prevent="shortenUrl">
        <div class="form">
          <div>
            <input
              class="input1"
              type="url"
              v-model="originalUrl"
              name="url-input"
              placeholder="Paste URL here"
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

          <div class="custom-input">
            <select name="" id="">
              <option value="">Choose Domain</option>
            </select>
            <input
              class="input2"
              type="text"
              v-model="customUrl"
              name="name"
              placeholder="Custom URL (optional)"
            />
          </div>
          <button type="submit">
            Shorten It <img src="../assets/images/magic wand.png" alt="" />
          </button>
          <p>
            By clicking TrimURL, I agree to the <span>Terms of Service,</span>
            <span>Privacy Policy</span> and Use of Cookies.
          </p>
        </div>
      </form>
    </div>

    <div class="grey-bg">
      <div class="link-section">
        <div class="link-title">
          <h2>My Recent URLs</h2>
        </div>
        <div class="link-container">
          <div class="link-container-header">
            <div class="left">
              <h5>Short Link</h5>
              <h5>Original Link</h5>
            </div>
            <div class="right">
              <h5>QR Code</h5>
              <h5>Clicks</h5>
              <h5>Location</h5>
              <h5>Date</h5>
              <h5>Actions</h5>
            </div>
          </div>
          <div v-if="shortenedLinks.length > 0">
            <div v-for="(link, index) in shortenedLinks" :key="index">
              <div class="links">
                <div class="left1">
                  <div class="sl">
                    <p>{{ link.shortened_url }}</p>
                    <button @click="copyToClipboard(link.shortened_url, index)">
                      de
                    </button>
                  </div>
                  <p>{{ link.originalUrl }}</p>
                </div>
                <div class="right2">
                  <p>code</p>
                  <p>12</p>
                  <p>Us</p>
                  <p>oct-12-2024</p>
                  <div>
                    <button  @click="deleteLink(index)">delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <footer-bg /> -->

    <!-- Add content for the dashboard -->
  </div>
</template>

<script setup lang="ts">
// import footerBg from "../components/footer-bg.vue";
import { ref, watchEffect } from "vue";
import axios from "axios";
import { auth, db } from "../firebase";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";

const originalUrl = ref<string>("");
const customUrl = ref<string>("");
const shortenedLinks = ref<
  Array<{ originalUrl: string; shortened_url: string }>
>([]);
const loading = ref<boolean>(false); // New loading indicator state
const errorMessage = ref<string>("");
const showMobileNav = ref<boolean>(false);

const storedLinks = localStorage.getItem("shortenedLinks");
if (storedLinks) {
  shortenedLinks.value = JSON.parse(storedLinks);
}

const shortenUrl = async () => {
  errorMessage.value = "";
  if (!originalUrl.value.trim()) {
    errorMessage.value = "Please enter a valid URL";
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post(
      "https://url-shortener-qnn7.onrender.com/api/v1/shorten",
      {
        url: originalUrl.value,
        domain: "shrtco.de",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const shortenedUrl = response.data["data"]["short_id"];

    // Save the shortened link to Firebase
    const docRef = await addDoc(collection(db, "shortenedLinks"), {
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
    originalUrl.value = "";
    customUrl.value = "";
  } catch (error) {
    console.error("Error shortening URL:", error);
    alert("Error shortening URL. Please try again.");
  } finally {
    // Set loading to false after the asynchronous operation completes or encounters an error
    loading.value = false;
  }

  addDoc(collection(db, "your-collection"), {})
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
};

const copyToClipboard = (text: string, index) => {
  navigator.clipboard.writeText(text).then(() => {
    // Set the copied state of the link to true
    // const index = shortenedLinks.value.findIndex(
    //   (link) => link.shortened_url === text
    // );
    shortenedLinks.value[index].copied = true;

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      shortenedLinks.value[index].copied = false;
    }, 2000);
  });
};

// Watch for changes in shortenedLinks and update local storage accordingly

const deleteLink = async (index: number) => {
  try {
   
    const deletedLink = shortenedLinks.value[index];
    await deleteDoc(doc(db, "shortenedLinks", deletedLink.shortened_url)); // Delete from Firestore

    // Remove the link from the local array
    shortenedLinks.value.splice(index, 1);

    // Update local storage
    localStorage.setItem("shortenedLinks", JSON.stringify(shortenedLinks.value));
  } catch (error) {
    console.error("Error deleting link:", error);
    alert("Error deleting link. Please try again.");
    return;
  }
};

watchEffect(() => {
  localStorage.setItem("shortenedLinks", JSON.stringify(shortenedLinks.value));
});
</script>

<style scoped>
/* Add your styles for the dashboard page here */
@import "../assets/styles/dashboard.css";
</style>
