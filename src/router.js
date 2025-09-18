// src/router.ts
import { auth } from './firebase'; // Replace with the correct path to your firebase configuration file
import { createRouter, createWebHistory } from 'vue-router';
import Shortener from './views/Shortener.vue';
import Login from './views/Login.vue';
import Signup from './views/Signup.vue';
import Dashboard from './views/Dashboard.vue';
import GetLinks from './views/GetLinks.vue';
import { onAuthStateChanged } from 'firebase/auth';
const routes = [
    { path: '/', component: Shortener },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/sh/:shortened_id', component: GetLinks },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
        beforeEnter: (to, from, next) => {
            const unwatch = onAuthStateChanged(auth, (user) => {
                if (user) {
                    // If user is authenticated, allow access to the dashboard
                    next();
                }
                else {
                    // If user is not authenticated, redirect to login
                    next('/login');
                }
                // Clean up the listener after checking the authentication state
                unwatch();
            });
        },
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
