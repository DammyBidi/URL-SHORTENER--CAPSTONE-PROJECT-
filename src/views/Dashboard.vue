<!-- src/views/Dashboard.vue -->
<template>
  <div>
    <nav>
      <div class="nav-logo">
        <h3>Shortly</h3>
      </div>
      <div class="user-details">
        <div class="user-image">
          <!-- Conditional rendering for the user's profile picture -->
          <img :src="userProfilePicture || defaultProfilePicture" alt="" />
        </div>
        <div>
          <p>Welcome {{ userFirstName }}</p>
          <button @click="handleLogout">Signout</button>
        </div>
      </div>
    </nav>
    <div class="bg-color">
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
                <option value="">Shortly</option>
              </select>
              <input
                class="input2"
                type="text"
                v-model="customUrl"
                name="name"
                placeholder="Custom back-half (optional)"
              />
            </div>
            <button type="submit">
              Shorten It <img src="../assets/images/magic wand.png" alt="" />
            </button>
            <p>
              By clicking Shorten It, I agree to the
              <span>Terms of Service,</span> <span>Privacy Policy</span> and Use
              of Cookies.
            </p>
          </div>
        </form>
      </div>

      <!-- <div class="grey-bg"> -->
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
            <div class="loading" v-if="loading">
              <p>Please wait your link is loading.....</p>
            </div>
            <div v-for="(link, index) in shortenedLinks" :key="index">
              <div class="links">
                <div class="left1">
                  <div class="sl">
                    <p>{{ link.shortened_url }}</p>
                    <button
                      @click="copyToClipboard(link.shortened_url, index)"
                      :class="{ 'violet-button': link.copied }"
                    >
                      {{ link.copied ? "Copied!" : "Copy" }}
                    </button>
                  </div>
                  <p>{{ link.originalUrl }}</p>
                </div>
                <div class="right2">
                  <div>
                    <img
                      :src="generateQRCode(link.shortened_url)"
                      alt="QR Code"
                    />
                  </div>
                  <p>12</p>
                  <p>Us</p>
                  <p>oct-12-2024</p>
                  <div>
                    <button @click="deleteLink(index)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile link section -->
        <div class="Mobile-Link-Container">
          <div v-if="shortenedLinks.length > 0">
            <div class="loading" v-if="loading">
              <p>Please wait your link is loading.....</p>
            </div>
            <div v-for="(link, index) in shortenedLinks" :key="index">
              <div class="Mobile-links">
                <p class="mobile-short">{{ link.shortened_url }}</p>
                <p>{{ link.originalUrl }}</p>
                <div class="qrcodeimage">
                  <img
                    :src="generateQRCode(link.shortened_url)"
                    alt="QR Code"
                  />
                </div>
                <p>Clicks: 12</p>
                <p>Location: Us</p>
                <p>Date: oct-12-2024</p>
                <hr />
                <div class="Mobile-action">
                  <button
                    @click="copyToClipboard(link.shortened_url, index)"
                    :class="{ 'violet-button': link.copied }"
                  >
                    {{ link.copied ? "Copied!" : "Copy" }}
                  </button>
                  <button @click="deleteLink(index)">Delete</button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>

    <footer-bg />

    <!-- Add content for the dashboard -->
  </div>
</template>

<script setup lang="ts">
// import footerBg from "../components/footer-bg.vue";
import { ref, onMounted, watchEffect } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { auth, db } from "../firebase";
import { signOut, getAuth, User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import footerBg from "../components/footer-bg.vue";

const router = useRouter();
const userProfilePicture = ref<string | null>(null);
const defaultProfilePicture = "/src/assets/images/default-profile-picture.jpeg"; // Default profile picture URL
const userFirstName = ref<string>("");
const originalUrl = ref<string>("");
const customUrl = ref<string>("");
const shortenedLinks = ref<
  Array<{ originalUrl: string; shortened_url: string; copied: boolean }>
>([]);
const loading = ref<boolean>(false); // New loading indicator state
const errorMessage = ref<string>("");
const showMobileNav = ref<boolean>(false);
// Store the client URL with the shortened ID in combineUrl
const combinedUrl = ref<string>("");

const storedLinks = localStorage.getItem("shortenedLinks");
if (storedLinks) {
  shortenedLinks.value = JSON.parse(storedLinks);
}

const shortenUrl = async () => {
  errorMessage.value = "";

  const normalizedUrl = originalUrl.value.trim().toLowerCase();
  if (!originalUrl.value.trim()) {
    errorMessage.value = "Please enter a valid URL";
    return;
  }
  // Check if the URL has already been shortened
  const existingLinkIndex = shortenedLinks.value.findIndex(
    (link) => link.originalUrl.toLowerCase() === normalizedUrl
  );
  if (existingLinkIndex !== -1) {
    // URL already exists in the list, provide feedback
    const existingShortenedUrl =
      shortenedLinks.value[existingLinkIndex].shortened_url;
    alert(
      `This URL has already been shortened:\n${existingShortenedUrl}, Please check your list of shortened URLs.`
    );
    return;
  }

  loading.value = true;
  try {
    const clientUrl = "http://localhost:5173";
    const response = await axios.post(
      "https://url-shortener-qnn7.onrender.com/api/v1/shorten",
      {
        url: originalUrl.value,
        slug: customUrl.value.trim(), // Include the custom slug in the payload
        domain: "shrtco.de",
      },
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
    const docRef = await addDoc(collection(db, "shortenedLinks"), {
      userId: auth.currentUser?.uid,
      originalUrl: originalUrl.value,
      shortened_url: combinedUrl.value,
    });

    // Update the local list of shortened links
    shortenedLinks.value.unshift({
      originalUrl: originalUrl.value,
      shortened_url: combinedUrl.value,
      copied: false,
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
  });
};

// Watch for changes in shortenedLinks and update local storage accordingly

//

const deleteLink = async (index: number) => {
  try {
    const deletedLink = shortenedLinks.value[index];
    const documentId = deletedLink.shortened_url.split("/").pop(); // Extract document ID from shortened URL
    if (!documentId) {
      throw new Error("Invalid document ID");
    }
    await deleteDoc(doc(collection(db, "shortenedLinks"), documentId)); // Delete from Firestore

    // Remove the link from the local array
    shortenedLinks.value.splice(index, 1);

    // Update local storage
    localStorage.setItem(
      "shortenedLinks",
      JSON.stringify(shortenedLinks.value)
    );
  } catch (error) {
    console.error("Error deleting link:", error);
    alert("Error deleting link. Please try again.");
  }
};

const generateQRCode = (text: string): string => {
  const baseUrl = "http://api.qrserver.com/v1/create-qr-code/";
  const encodedText = encodeURIComponent(text);
  const size = "80x80"; // Adjust size as needed
  return `${baseUrl}?data=${encodedText}&size=${size}`;
};

watchEffect(() => {
  localStorage.setItem("shortenedLinks", JSON.stringify(shortenedLinks.value));
});

// Function to fetch user data and update reactive variables
const fetchUserData = () => {
  const user = auth.currentUser;
  if (user) {
    // Check if the user has a profile picture URL
    if (user.photoURL) {
      userProfilePicture.value = user.photoURL;
    } else {
      userProfilePicture.value = defaultProfilePicture; // Set default profile picture
    }
    // Set the user's name (if available) or email address
    userFirstName.value = getFirstName(user.displayName ?? user.email ?? "");
  }
};

// Function to extract the first name from the display name or email address
const getFirstName = (fullName: string): string => {
  // Split the full name by whitespace
  const names = fullName.split(" ");
  // Return the first name (if available)
  return names[0];
};

onMounted(fetchUserData);

const handleLogout = async () => {
  try {
    await signOut(getAuth());
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
/* Add your styles for the dashboard page here */
@import "../assets/styles/dashboard.css";
</style>
