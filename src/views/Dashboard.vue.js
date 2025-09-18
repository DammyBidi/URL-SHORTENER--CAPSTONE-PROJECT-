import { ref, onMounted, watchEffect } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { auth, db } from "../firebase";
import { signOut, getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import footerBg from "../components/footer-bg.vue";
const router = useRouter();
const userProfilePicture = ref(null);
const defaultProfilePicture = "/src/assets/images/default-profile-picture.jpeg"; // Default profile picture URL
const userFirstName = ref("");
const originalUrl = ref("");
const customUrl = ref("");
const shortenedLinks = ref([]);
const loading = ref(false); // New loading indicator state
const errorMessage = ref("");
// Store the client URL with the shortened ID in combineUrl
const combinedUrl = ref("");
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
    const existingLinkIndex = shortenedLinks.value.findIndex((link) => link.originalUrl.toLowerCase() === normalizedUrl);
    if (existingLinkIndex !== -1) {
        // URL already exists in the list, provide feedback
        const existingShortenedUrl = shortenedLinks.value[existingLinkIndex].shortened_url;
        alert(`This URL has already been shortened:\n${existingShortenedUrl}, Please check your list of shortened URLs.`);
        return;
    }
    loading.value = true;
    try {
        const clientUrl = "localhost:5173";
        const response = await axios.post("https://url-shortener-qnn7.onrender.com/api/v1/shorten", {
            url: originalUrl.value,
            slug: customUrl.value.trim(), // Include the custom slug in the payload
            domain: "shrtco.de",
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const shortenedUrl = response.data["data"]["short_id"];
        const created_at = response.data["data"]["created_at"];
        const currentDate = new Date(created_at).toLocaleDateString(); // Convert the created_at date to a human-readable format
        combinedUrl.value = `${clientUrl}/sh/${shortenedUrl}`;
        // This is the shortened URL that is to be saved to Firebase and visited by the user
        console.log(combinedUrl.value);
        // Save the shortened link to Firestore using the short id as document ID
        const shortId = shortenedUrl; // short id returned by API
        const docRef = doc(db, 'shortenedLinks', shortId);
        await setDoc(docRef, {
            userId: auth.currentUser?.uid,
            originalUrl: originalUrl.value,
            shortened_url: combinedUrl.value,
            date: currentDate,
            clicks: 0,
        });
        // Update the local list of shortened links
        shortenedLinks.value.unshift({
            originalUrl: originalUrl.value,
            shortened_url: combinedUrl.value,
            copied: false,
            date: currentDate,
        });
        // Clear input fields
        originalUrl.value = "";
        customUrl.value = "";
    }
    catch (error) {
        console.error("Error shortening URL:", error);
        alert("Error shortening URL. Please try again.");
    }
    finally {
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
const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
        // Set the copied state of the link to true
        const index = shortenedLinks.value.findIndex((link) => link.shortened_url === text);
        shortenedLinks.value[index].copied = true;
        // Reset the copied state after 2 seconds
        setTimeout(() => {
            shortenedLinks.value[index].copied = false;
        }, 2000);
    });
};
// Watch for changes in shortenedLinks and update local storage accordingly
//
const deleteLink = async (index) => {
    try {
        const deletedLink = shortenedLinks.value[index];
        // If we stored the Firestore document ID earlier, use it directly
        if (deletedLink.docId) {
            await deleteDoc(doc(db, 'shortenedLinks', deletedLink.docId));
        }
        else {
            // Fallback: query for document where shortened_url matches and userId matches
            const q = query(collection(db, 'shortenedLinks'), where('shortened_url', '==', deletedLink.shortened_url), where('userId', '==', auth.currentUser?.uid));
            const snap = await getDocs(q);
            if (!snap.empty) {
                snap.forEach(async (d) => {
                    await deleteDoc(doc(db, 'shortenedLinks', d.id));
                });
            }
        }
        // Remove the link from the local array
        shortenedLinks.value.splice(index, 1);
        // Update local storage
        localStorage.setItem('shortenedLinks', JSON.stringify(shortenedLinks.value));
    }
    catch (error) {
        console.error('Error deleting link:', error);
        alert('Error deleting link. Please try again.');
    }
};
const generateQRCode = (text) => {
    const baseUrl = "https://api.qrserver.com/v1/create-qr-code/";
    const encodedText = encodeURIComponent(text);
    const size = "80x80"; // Adjust size as needed
    return `${baseUrl}?data=${encodedText}&size=${size}`;
};
// Download the generated QR code as an image file
const downloadQRCode = async (text, index) => {
    try {
        const url = generateQRCode(text);
        const resp = await fetch(url);
        if (!resp.ok)
            throw new Error(`Failed to fetch QR code: ${resp.status}`);
        const blob = await resp.blob();
        const filename = `qrcode_${index || Date.now()}.png`;
        // Create a temporary anchor to trigger the download
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
    }
    catch (err) {
        console.error("Error downloading QR code", err);
        alert("Unable to download QR code. Please try again.");
    }
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
        }
        else {
            userProfilePicture.value = defaultProfilePicture; // Set default profile picture
        }
        // Set the user's name (if available) or email address
        userFirstName.value = getFirstName(user.displayName ?? user.email ?? "");
    }
};
// Fetch user's shortened links (with clicks) on mount
const fetchShortenedLinks = async () => {
    loading.value = true;
    try {
        const q = query(collection(db, 'shortenedLinks'), where('userId', '==', auth.currentUser?.uid));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach((d) => {
            const data = d.data();
            items.push({
                originalUrl: data.originalUrl,
                shortened_url: data.shortened_url,
                copied: false,
                date: data.date,
                clicks: data.clicks ?? 0,
                docId: d.id,
            });
        });
        shortenedLinks.value = items.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    catch (err) {
        console.warn('Failed to load shortened links', err);
    }
    finally {
        loading.value = false;
    }
};
// Function to extract the first name from the display name or email address
const getFirstName = (fullName) => {
    // Split the full name by whitespace
    const names = fullName.split(" ");
    // Return the first name (if available)
    return names[0];
};
onMounted(() => {
    fetchUserData();
    fetchShortenedLinks();
});
const handleLogout = async () => {
    try {
        await signOut(getAuth());
        router.push("/");
    }
    catch (error) {
        console.log(error);
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "nav-logo" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "user-details" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "user-image" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: (__VLS_ctx.userProfilePicture || __VLS_ctx.defaultProfilePicture),
    alt: "",
});
// @ts-ignore
[userProfilePicture, defaultProfilePicture,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.userFirstName);
// @ts-ignore
[userFirstName,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleLogout) },
});
// @ts-ignore
[handleLogout,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "bg-color" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "background-image1" },
});
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.shortenUrl) },
});
// @ts-ignore
[shortenUrl,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.input)({
    ...{ class: "input1" },
    type: "url",
    name: "url-input",
    placeholder: "Paste URL here",
    ...{ class: ({ 'error-input': __VLS_ctx.errorMessage }) },
    ...{ style: ({
            borderColor: __VLS_ctx.errorMessage ? 'hsl(0, 87%, 67%)' : '',
            color: __VLS_ctx.errorMessage ? 'hsl(0, 87%, 67%)' : '',
        }) },
});
(__VLS_ctx.originalUrl);
// @ts-ignore
[errorMessage, errorMessage, errorMessage, originalUrl,];
if (__VLS_ctx.errorMessage) {
    // @ts-ignore
    [errorMessage,];
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        ...{ class: "error-message" },
        for: "url-input",
    });
    __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({});
    (__VLS_ctx.errorMessage);
    // @ts-ignore
    [errorMessage,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "custom-input" },
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    name: "",
    id: "",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    ...{ class: "input2" },
    type: "text",
    value: (__VLS_ctx.customUrl),
    name: "name",
    placeholder: "Custom back-half (optional)",
});
// @ts-ignore
[customUrl,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "../assets/images/magic wand.png",
    alt: "",
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "link-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "link-title" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "link-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "link-container-header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "left" },
});
__VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({});
__VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "right" },
});
__VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({});
__VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({});
__VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({});
__VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({});
__VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({});
if (__VLS_ctx.shortenedLinks.length > 0) {
    // @ts-ignore
    [shortenedLinks,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    if (__VLS_ctx.loading) {
        // @ts-ignore
        [loading,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "loading" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    }
    for (const [link, index] of __VLS_getVForSourceType((__VLS_ctx.shortenedLinks))) {
        // @ts-ignore
        [shortenedLinks,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (index),
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "links" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "left1" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "sl" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "des-shortlink" },
        });
        (link.shortened_url);
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.shortenedLinks.length > 0))
                        return;
                    __VLS_ctx.copyToClipboard(link.shortened_url, index);
                    // @ts-ignore
                    [copyToClipboard,];
                } },
            ...{ class: ({ 'violet-button': link.copied }) },
        });
        (link.copied ? "Copied!" : "Copy");
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (link.originalUrl);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "right2" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "qr-block" },
        });
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.generateQRCode(link.shortened_url)),
            alt: "QR Code",
        });
        // @ts-ignore
        [generateQRCode,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "qr-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.shortenedLinks.length > 0))
                        return;
                    __VLS_ctx.downloadQRCode(link.shortened_url, index);
                    // @ts-ignore
                    [downloadQRCode,];
                } },
        });
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: "../assets/images/download.png",
            alt: "",
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (link.clicks ?? 0);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (link.date);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.shortenedLinks.length > 0))
                        return;
                    __VLS_ctx.deleteLink(index);
                    // @ts-ignore
                    [deleteLink,];
                } },
        });
    }
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "Mobile-Link-Container" },
});
if (__VLS_ctx.shortenedLinks.length > 0) {
    // @ts-ignore
    [shortenedLinks,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    if (__VLS_ctx.loading) {
        // @ts-ignore
        [loading,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "loading" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    }
    for (const [link, index] of __VLS_getVForSourceType((__VLS_ctx.shortenedLinks))) {
        // @ts-ignore
        [shortenedLinks,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (index),
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "Mobile-links" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "mobile-short" },
        });
        (link.shortened_url);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (link.originalUrl);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "qrcodeimage" },
        });
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.generateQRCode(link.shortened_url)),
            alt: "QR Code",
        });
        // @ts-ignore
        [generateQRCode,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "qr-actions-mobile" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.shortenedLinks.length > 0))
                        return;
                    __VLS_ctx.downloadQRCode(link.shortened_url, index);
                    // @ts-ignore
                    [downloadQRCode,];
                } },
        });
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: "../assets/images/download.png",
            alt: "",
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (link.clicks ?? 0);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (link.date);
        __VLS_asFunctionalElement(__VLS_elements.hr)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "Mobile-action" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.shortenedLinks.length > 0))
                        return;
                    __VLS_ctx.copyToClipboard(link.shortened_url, index);
                    // @ts-ignore
                    [copyToClipboard,];
                } },
            ...{ class: ({ 'violet-button': link.copied }) },
        });
        (link.copied ? "Copied!" : "Copy");
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.shortenedLinks.length > 0))
                        return;
                    __VLS_ctx.deleteLink(index);
                    // @ts-ignore
                    [deleteLink,];
                } },
        });
    }
}
/** @type {[typeof footerBg, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(footerBg, new footerBg({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {__VLS_StyleScopedClasses['nav-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['user-details']} */ ;
/** @type {__VLS_StyleScopedClasses['user-image']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-color']} */ ;
/** @type {__VLS_StyleScopedClasses['background-image1']} */ ;
/** @type {__VLS_StyleScopedClasses['form']} */ ;
/** @type {__VLS_StyleScopedClasses['input1']} */ ;
/** @type {__VLS_StyleScopedClasses['error-input']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-input']} */ ;
/** @type {__VLS_StyleScopedClasses['input2']} */ ;
/** @type {__VLS_StyleScopedClasses['link-section']} */ ;
/** @type {__VLS_StyleScopedClasses['link-title']} */ ;
/** @type {__VLS_StyleScopedClasses['link-container']} */ ;
/** @type {__VLS_StyleScopedClasses['link-container-header']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['links']} */ ;
/** @type {__VLS_StyleScopedClasses['left1']} */ ;
/** @type {__VLS_StyleScopedClasses['sl']} */ ;
/** @type {__VLS_StyleScopedClasses['des-shortlink']} */ ;
/** @type {__VLS_StyleScopedClasses['violet-button']} */ ;
/** @type {__VLS_StyleScopedClasses['right2']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-block']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['Mobile-Link-Container']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['Mobile-links']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-short']} */ ;
/** @type {__VLS_StyleScopedClasses['qrcodeimage']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-actions-mobile']} */ ;
/** @type {__VLS_StyleScopedClasses['Mobile-action']} */ ;
/** @type {__VLS_StyleScopedClasses['violet-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        footerBg: footerBg,
        userProfilePicture: userProfilePicture,
        defaultProfilePicture: defaultProfilePicture,
        userFirstName: userFirstName,
        originalUrl: originalUrl,
        customUrl: customUrl,
        shortenedLinks: shortenedLinks,
        loading: loading,
        errorMessage: errorMessage,
        shortenUrl: shortenUrl,
        copyToClipboard: copyToClipboard,
        deleteLink: deleteLink,
        generateQRCode: generateQRCode,
        downloadQRCode: downloadQRCode,
        handleLogout: handleLogout,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
