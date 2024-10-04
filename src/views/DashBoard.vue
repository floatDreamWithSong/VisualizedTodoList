<script setup lang="ts">

import { useCounterStore } from '@/stores/counter';
import { ref } from 'vue';
const theme = useCounterStore()
const sideBarStatus = ref(' custom-box-grid');
const userEmail = '956968770@qq.com'
const userName = 'floateDreamer'
const avatarLink = 'https://q4.qlogo.cn/g?b=qq&nk='+956968770+'&s=40'
const currentPageIndex = ref(0);
const switchSideBarStatus = () => {
  // console.log('1')
  sideBarStatus.value===' custom-box-grid'?' custom-box-grid-close':' custom-box-grid'
}
const sideNavInfo = [{
  text:'work panel',
  link:'/',
  ico:'bi-window-dock'
},{
  text:'profile',
  link:'/dashboard/profile',
  ico:'bi-person'
},{
  text:'settings',
  link:'/dashboard/settings',
  ico:'bi-sliders'
}]
</script>
<template>
    <div id="dash-box" class=" w-full h-full font-semibold  p-4 grid " :class="(theme.isDarkMode?'text-slate-200':'text-slate-800')+sideBarStatus">
        <div id="dash-side" class="h-full relative ">
          <div id="status-box" class="h-20 custom-status-grid" >
            <div class="avatar-box flex items-center justify-center">
              <img class="w-[40px] aspect-square rounded-full" :src="avatarLink" alt="">
            </div>
            <div class="user-name flex items-center">{{userName}}</div>
            <div class="user-email text-[0.7rem] text-slate-500">{{userEmail}}</div>
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
          <div class="w-full absolute bottom-0 *:ml-4  *:transition-all *:hover:cursor-pointer *:aspect-square *:px-1 *:text-xl *:rounded-full">
            <i @click="theme.switchMode" class="hover:bg-gray-600/50"  :class="theme.isDarkMode?'bi-brightness-low-fill':'bi-moon-stars-fill'" />
            <i @click="switchSideBarStatus" class="bi-chevron-double-right hover:bg-gray-600/50"/>
          </div>
        </div>
        <main class="pl-4">
          <RouterView />
        </main>
      </div>
</template>
<style scoped>
.custom-box-grid {
    grid-template-columns: 200px 1fr;
  }
  .custom-box-grid-close{
    grid-template-columns: 100px 1fr;
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
