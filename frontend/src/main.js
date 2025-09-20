import { createApp } from 'vue';
import { provideApolloClient } from '@vue/apollo-composable';
import App from './App.vue';
import router from './router';
import apolloClient from './apollo/client';
import './style.css';
import './colors.css';

const app = createApp(App);
provideApolloClient(apolloClient);
app.use(router);
app.mount('#app');