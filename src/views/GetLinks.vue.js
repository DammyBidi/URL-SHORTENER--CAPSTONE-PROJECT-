import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { db, analytics } from "../firebase";
import { updateDoc, doc, increment } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
const router = useRouter();
const route = useRoute();
const shortenedId = String(route.params.shortened_id); // Access the dynamic parameter
const loading = ref(true); // Flag for loading state
const errorMessage = ref(""); // Placeholder for error message
const redirect = async () => {
    try {
        loading.value = true; // Set loading indicator
        console.log('shortenedId<<<<< ', shortenedId);
        const response = await axios.get(`https://url-shortener-qnn7.onrender.com/api/v1/${shortenedId}`); // Adjust API endpoint path
        console.log("Response: " + response.data["data"]["original_url"]);
        const originalUrl = response.data["data"]["original_url"];
        // Log an Analytics event for the short link click
        try {
            if (analytics) {
                logEvent(analytics, 'short_link_click', { short_id: shortenedId });
            }
        }
        catch (err) {
            console.warn('Analytics logging failed', err);
        }
        // Increment clicks counter in Firestore (non-blocking for redirect)
        try {
            const docRef = doc(db, 'shortenedLinks', shortenedId);
            await updateDoc(docRef, { clicks: increment(1) });
        }
        catch (err) {
            // If the document doesn't exist or update fails, silently continue and redirect
            console.warn('Failed to increment click count in Firestore', err);
        }
        // Redirect to original URL
        window.location.href = originalUrl;
    }
    catch (error) {
        console.error("Error fetching original URL:", error);
        errorMessage.value = "Failed to redirect. Please try again later.";
    }
    finally {
        loading.value = false; // Hide loading indicator
    }
};
onMounted(redirect); // Call the redirect function on component mount
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
if (__VLS_ctx.errorMessage) {
    // @ts-ignore
    [errorMessage,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.errorMessage);
    // @ts-ignore
    [errorMessage,];
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        loading: loading,
        errorMessage: errorMessage,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
