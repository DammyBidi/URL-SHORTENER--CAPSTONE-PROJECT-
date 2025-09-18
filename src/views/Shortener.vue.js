import { ref, watchEffect } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
// import { addDoc, collection } from "firebase/firestore";
import footerBg from '../components/footer-bg.vue';
// import { getFirestore } from 'firebase/firestore';
const router = useRouter();
const originalUrl = ref("");
const customUrl = ref("");
const shortenedLinks = ref([]);
const lastTwoShortenedLinks = ref([]);
const loading = ref(false); // New loading indicator state
const errorMessage = ref("");
const showMobileNav = ref(false);
// Store the client URL with the shortened ID in combineUrl 
const combinedUrl = ref("");
const amountOfLinks = ref(0);
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
    }
    else {
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
    if (amountOfLinks.value > 2) {
        errorMessage.value = "You have reached the maximum amount of links allowed please signup or login to get more links";
        alert("You have reached the maximum amount of links allowed please signup or login to get more links");
        return;
    }
    amountOfLinks.value += 1;
    loading.value = true;
    try {
        const clientUrl = 's-h.netlify.app/';
        const response = await axios.post("https://url-shortener-qnn7.onrender.com/api/v1/shorten", { url: originalUrl.value }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
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
    }
    catch (error) {
        console.error("Error shortening URL:", error);
        alert("Error shortening URL. Please try again.");
    }
    finally {
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
const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
        // Set the copied state of the link to true
        const index = shortenedLinks.value.findIndex((link) => link.shortened_url === text);
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
    ...{ class: "links" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "",
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "",
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "login" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/login",
}));
const __VLS_2 = __VLS_1({
    to: "/login",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
const __VLS_5 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    to: "/Signup",
}));
const __VLS_7 = __VLS_6({
    to: "/Signup",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({});
var __VLS_8;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.toggleMobileNav) },
    ...{ class: "mobile-nav-toggle" },
});
// @ts-ignore
[toggleMobileNav,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/src/assets/images/menu.png",
    alt: "Menu logo",
});
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({});
if (__VLS_ctx.showMobileNav) {
    // @ts-ignore
    [showMobileNav,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mobile-nav" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mobile-links" },
    });
    __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
        href: "",
    });
    __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
        href: "",
    });
    __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
        href: "",
    });
    __VLS_asFunctionalElement(__VLS_elements.hr)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mobile-login" },
    });
    const __VLS_10 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        to: "/login",
    }));
    const __VLS_12 = __VLS_11({
        to: "/login",
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    const { default: __VLS_14 } = __VLS_13.slots;
    var __VLS_13;
    const __VLS_15 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    RouterLink;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        to: "/Signup",
    }));
    const __VLS_17 = __VLS_16({
        to: "/Signup",
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    const { default: __VLS_19 } = __VLS_18.slots;
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({});
    var __VLS_18;
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "hero" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "text" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
const __VLS_20 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    to: "/Signup",
}));
const __VLS_22 = __VLS_21({
    to: "/Signup",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_24 } = __VLS_23.slots;
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({});
var __VLS_23;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "image" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/src/assets/images/illustration-working.svg",
    alt: "illustration of a person working on a computer",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "warning" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form" },
});
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.shortenUrl) },
});
// @ts-ignore
[shortenUrl,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-container" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "url",
    name: "url-input",
    placeholder: "Shorten a link here...",
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
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "grey-bg" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "link-section" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
}
if (__VLS_ctx.lastTwoShortenedLinks.length > 0) {
    // @ts-ignore
    [lastTwoShortenedLinks,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    for (const [link, index] of __VLS_getVForSourceType((__VLS_ctx.lastTwoShortenedLinks))) {
        // @ts-ignore
        [lastTwoShortenedLinks,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (index),
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "link-container" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "original-link" },
        });
        (link.originalUrl);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "short-link" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (link.shortened_url);
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.lastTwoShortenedLinks.length > 0))
                        return;
                    __VLS_ctx.copyToClipboard(link.shortened_url, index);
                    // @ts-ignore
                    [copyToClipboard,];
                } },
            ...{ class: ({ 'violet-button': link.copied }) },
        });
        (link.copied ? "Copied!" : "Copy");
    }
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "statistics" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "statistics-title" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "cards" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card c1" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card-icon" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/src/assets//images/icon-brand-recognition.svg",
    alt: "brand recognition icon",
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.br)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card c2" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card-icon" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/src/assets//images/icon-detailed-records.svg",
    alt: "detailed records icon",
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card c3" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card-icon" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/src/assets//images/icon-fully-customizable.svg",
    alt: "fully customizable icon",
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.br)({});
__VLS_asFunctionalElement(__VLS_elements.br)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "connect-line" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "boost" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
const __VLS_25 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    to: "/Signup",
}));
const __VLS_27 = __VLS_26({
    to: "/Signup",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_29 } = __VLS_28.slots;
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({});
var __VLS_28;
/** @type {[typeof footerBg, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(footerBg, new footerBg({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
/** @type {__VLS_StyleScopedClasses['links']} */ ;
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-nav-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-links']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-login']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['image']} */ ;
/** @type {__VLS_StyleScopedClasses['warning']} */ ;
/** @type {__VLS_StyleScopedClasses['form']} */ ;
/** @type {__VLS_StyleScopedClasses['input-container']} */ ;
/** @type {__VLS_StyleScopedClasses['error-input']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['grey-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['link-section']} */ ;
/** @type {__VLS_StyleScopedClasses['link-container']} */ ;
/** @type {__VLS_StyleScopedClasses['original-link']} */ ;
/** @type {__VLS_StyleScopedClasses['short-link']} */ ;
/** @type {__VLS_StyleScopedClasses['violet-button']} */ ;
/** @type {__VLS_StyleScopedClasses['statistics']} */ ;
/** @type {__VLS_StyleScopedClasses['statistics-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cards']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['c1']} */ ;
/** @type {__VLS_StyleScopedClasses['card-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['c2']} */ ;
/** @type {__VLS_StyleScopedClasses['card-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['c3']} */ ;
/** @type {__VLS_StyleScopedClasses['card-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['connect-line']} */ ;
/** @type {__VLS_StyleScopedClasses['boost']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        footerBg: footerBg,
        originalUrl: originalUrl,
        lastTwoShortenedLinks: lastTwoShortenedLinks,
        loading: loading,
        errorMessage: errorMessage,
        showMobileNav: showMobileNav,
        shortenUrl: shortenUrl,
        copyToClipboard: copyToClipboard,
        toggleMobileNav: toggleMobileNav,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
