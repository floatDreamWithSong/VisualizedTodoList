<script setup lang="ts">
import router from '@/router';
import { useCounterStore } from '@/stores/counter';
import { ref } from 'vue';
const theme = useCounterStore()
console.log(router.currentRoute.value.fullPath)
const userEmail = '956968770@qq.com'
const userName = 'floateDreamer'
const avatarLink = 'https://q4.qlogo.cn/g?b=qq&nk='+956968770+'&s=40'
const currentPageIndex = ref(0);
const sideNavInfo = [{
  text:'work panel',
  link:'/',
  ico:'bi-window-dock'
},{
  text:'profile',
  link:'/dashboard/profile',
  ico:'bi-person'
},{
  text:'work panel',
  link:'/dashboard/settings',
  ico:'bi-sliders'
}]
</script>
<template>
    <div id="dash-box" class=" w-full h-full font-semibold  p-4 custom-box-grid" :class="theme.isDarkMode?'text-slate-200':'text-slate-800'">
        <div id="dash-side" class="h-full relative">
          <div id="status-box" class="h-20 custom-status-grid" >
            <div class="avatar-box flex items-center justify-center">
              <img class=" rounded-full" :src="avatarLink" alt="">
            </div>
            <div class="user-name flex items-center">{{userName}}</div>
            <div class="user-email text-[0.7rem] text-slate-600">{{userEmail}}</div>
          </div>
          <hr class="h-[2px] w-5/6 mx-auto bg-black/10 mb-4">
          <nav class=" flex-col flex" >
            <RouterLink class="mx-4 my-2 text-lg custom-nav-grid" @click="currentPageIndex = id" v-for="(i,id) in sideNavInfo"
             :class="id===currentPageIndex?(theme.isDarkMode?'text-slate-200 bg-white/10': 'text-slate-900 bg-slate-100/40')+' shadow-md rounded-lg':(theme.isDarkMode?'text-slate-400':'text-slate-600')" 
             :key="id" :to="i.link">
              <i class="ml-3 my-1 mr-4" :class="i.ico"></i>
              <p class="flex items-center">{{i.text}}</p>
            </RouterLink>
          </nav>
          <div class="w-full absolute bottom-0">
            <i @click="theme.switchMode" class="hover:bg-gray-600/50 transition-all aspect-square px-1 text-2xl rounded-full" :class="theme.isDarkMode?'bi-brightness-low-fill':'bi-moon-stars-fill'"></i>
          </div>
        </div>
        <main class="pl-4">
          <RouterView />
        </main>
      </div>
</template>
<style scoped>
.custom-box-grid {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
.custom-status-grid{
  display: grid;
  grid-template-rows: repeat(5, 1fr);
	grid-template-columns: repeat(6, 1fr);
}
.avatar-box{
  grid-area: 1 / 1 / 6 / 3;
}
.user-name {
	grid-area: 2 / 3 / 4 / 7;
}
.user-email {
	grid-area: 4 / 3 / 5 / 7;
}
.custom-nav-grid{
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>