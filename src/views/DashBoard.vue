<script setup lang="ts">

import { useCounterStore } from '@/stores/counter';
import { reset } from '@/tools/canvas';
import { ref } from 'vue';
const theme = useCounterStore()
const sideBarStatus = ref(true);
const userEmail = '956968770@qq.com'
const userName = 'floateDreamer'
const avatarLink = 'https://q4.qlogo.cn/g?b=qq&nk='+956968770+'&s=40'
const currentPageIndex = ref(0);
const switchSideBarStatus = () => {
  sideBarStatus.value  = !sideBarStatus.value
  setTimeout(()=>reset(500),300)
}
const sideNavInfo = [{
  text:'WorkSheet',
  link:'/',
  ico:'bi-window-dock'
},{
  text:'WorkBench',
  link:'/dashboard/workbench',
  ico:'bi-person'
}
// ,
// {
//   text:'Settings',
//   link:'/dashboard/settings',
//   ico:'bi-sliders'
// }
]
</script>
<template>
    <div id="dash-box" class=" w-full h-full font-semibold  p-4 grid custom-box-grid transition-all" :class="(theme.isDarkMode?'text-slate-200':'text-slate-800')+(sideBarStatus?' custom-box-grid':' custom-close-grid')">
        <div  id="dash-side" class="h-full relative w-40 overflow-hidden" :class="sideBarStatus?'':' -z-10'">
          <div v-show="sideBarStatus" id="status-box" class="mb-2 rounded-lg h-20 custom-status-grid" >
            <div class="avatar-box flex items-center justify-center ">
              <img  class=" w-8 aspect-square rounded-full" :src="avatarLink" alt="">
            </div>
            <div class="user-name flex items-center">{{userName}}</div>
            <div class="user-email text-[0.7rem] text-slate-500">{{userEmail}}</div>
          </div>
          <hr v-show="sideBarStatus" class="h-[2px] mx-auto bg-black/10 mb-4">
          <nav v-show="sideBarStatus" class=" flex-col flex" >
            <RouterLink class="mx-1 my-2 text-lg custom-nav-grid" @click="currentPageIndex = id" v-for="(i,id) in sideNavInfo"
             :class="id===currentPageIndex?(theme.isDarkMode?'text-slate-200 bg-white/10': 'text-slate-900 bg-slate-100/40')+' shadow-md rounded-lg':(theme.isDarkMode?'text-slate-400':'text-slate-600')"
             :key="id" :to="i.link">
              <i class="ml-3 my-1 mr-4 text-base" :class="i.ico"></i>
              <p class="flex items-center text-sm">{{i.text}}</p>
            </RouterLink>
          </nav>

        </div>

        <main class="pl-4 h-full overflow-y-scroll">
          <RouterView v-slot="{Component}">
            <component :is="Component">
              <template #close>
                <i @click="switchSideBarStatus" class=" hover:bg-gray-600/50 bi-three-dots"/>
              </template>
              <template #darkmode>
                <i @click="theme.switchMode" class="hover:bg-gray-600/50 "  :class="theme.isDarkMode?'bi-brightness-low-fill':'bi-moon-stars-fill'" />
              </template>
            </component>
          </RouterView>
        </main>
      </div>
</template>
<style scoped>
.custom-box-grid {
    grid-template-columns: 200px 1fr;
  }
  .custom-close-grid{
    grid-template-columns: 1px 1fr;
    #status-box{
      width: 1px;
    }
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
::-webkit-scrollbar {
  display: none;
}
</style>
