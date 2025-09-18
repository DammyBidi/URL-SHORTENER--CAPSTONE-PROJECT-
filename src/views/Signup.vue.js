import { ref } from "vue";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "vue-router";
const email = ref("");
const password = ref("");
const router = useRouter();
const signupUser = async () => {
    try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        // Redirect to dashboard after successful signup
        router.push("/dashboard");
    }
    catch (error) {
        console.error("Error signing up:", error);
    }
};
const signUpWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // Redirect to dashboard after successful sign-up
        router.push("/dashboard");
    }
    catch (error) {
        console.error("Error signing up with Google:", error);
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "main" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "left" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "text" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/Login",
}));
const __VLS_2 = __VLS_1({
    to: "/Login",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.signUpWithGoogle) },
    ...{ class: "provider-btn" },
});
// @ts-ignore
[signUpWithGoogle,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ class: "google-btn-logo" },
    src: "../assets/images/google.png",
    alt: "",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "line" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "line" },
});
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.signupUser) },
});
// @ts-ignore
[signupUser,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "email",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "email",
    id: "email",
    required: true,
});
(__VLS_ctx.email);
// @ts-ignore
[email,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "password",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    id: "password",
    required: true,
});
(__VLS_ctx.password);
// @ts-ignore
[password,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ class: "login-btn" },
    type: "submit",
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "right" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "image" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "img-div" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "../assets/images/signupimage.jpg",
    alt: "login",
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
/** @type {__VLS_StyleScopedClasses['main']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['provider-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['google-btn-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['line']} */ ;
/** @type {__VLS_StyleScopedClasses['line']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['image']} */ ;
/** @type {__VLS_StyleScopedClasses['img-div']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        email: email,
        password: password,
        signupUser: signupUser,
        signUpWithGoogle: signUpWithGoogle,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
