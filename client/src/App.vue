<script setup lang="ts">
import { Navbar, ModalDialog,Button, LoadingSkeleton  } from "./components";
import { ref } from 'vue';
import { useFetch } from '@vueuse/core'

const showModal = ref(false);
const deleteModal = ref(false)
const { isFetching, data, isFinished } =  useFetch<Array<{ label: string, photoUrl: string }>>("http://localhost:3000/all").get().json()
console.log(data)
function showMyModal (bool: boolean) {
  showModal.value = bool
}

function deleteMyModal (bool: boolean) {
  deleteModal.value = bool
}



</script>

<template>
  <div class="min-h-screen mx-8 my-2">
    <Navbar :show-modal="showMyModal" />
    <div class="mt-2 container gap-8 columns-3">
      <template v-if="isFinished && !isFetching">
        <div class="w-full flex mb-6" v-for="(item,index) in data" :key="item.label">
          <img id="image" class="w-full rounded-lg" :class="[ index / 2 == 0? 'aspect-video' : 'aspect-square' ]" :src="item.photoUrl" />
          <div class="absolute flex flex-col" id="hover" style="padding:10px 10px;">
            <h4 style="color:black;margin-bottom: 10px;" class="font-medium font-noto-sans">{{ item.label }}</h4>
            <Button @click="deleteMyModal(true)" class="border-black rounded-lg border-red" style="background-color: inherit;width:100px;" text-button="Delete it" />
          </div>
        </div>
      </template>
      <template v-else>
        <LoadingSkeleton width="100%" class="aspect-video mb-6" />
        <LoadingSkeleton width="100%" class="aspect-square mb-6" />
        <LoadingSkeleton width="100%" class="aspect-video mb-6" />
        <LoadingSkeleton width="100%" class="aspect-square mb-6" />
        <LoadingSkeleton width="100%" class="aspect-video mb-6" />
        <LoadingSkeleton width="100%" class="aspect-square mb-6" />
      </template>
    </div>
    <ModalDialog :show="showModal" @close="showModal = false"> 
      <template v-slot:header>
        <h1 class="font-noto-sans font-medium text-lg">Add a new Photo</h1>
      </template>

      <div class="flex flex-col mb-10">
        <label for="Label" class="font-noto-sans text-md mb-10">Label</label>
        <input class="w-full border-black p-15 rounded-lg text-xs" placeholder="Fill it" />
      </div>

      <div class="flex flex-col">
        <label for="Photo URL" class="font-noto-sans text-md mb-10">Photo URL</label>
        <input class="w-full border-black p-15 rounded-lg text-xs" placeholder="Fill it" />
      </div>

      <template v-slot:footer>
        <Button type="button" @click="showModal = false" class="border-none bg-white text-gray" text-button="Cancel" />
        <Button class="text-white bg-green border-none btn-lg rounded-lg border-green" style="margin-left: 10px;" text-button="Submit" />
      </template>
    </ModalDialog>
    <ModalDialog :show="deleteModal" @close="deleteModal = false"> 
      <template v-slot:header>
        <h1 class="font-noto-sans font-medium text-lg">Are you sure</h1>
      </template>

      <div class="flex flex-col mb-10">
        <label for="Label" class="font-noto-sans text-md mb-10">Password</label>
        <input class="w-full border-black p-15 rounded-lg text-xs" placeholder="**********" />
      </div>

      <template v-slot:footer>
        <Button type="button" @click="deleteModal = false" class="border-none bg-white text-gray" text-button="Cancel" />
        <Button class="text-white bg-red border-none btn-lg rounded-lg border-red" style="margin-left: 10px;" text-button="Delete" />
      </template>
    </ModalDialog> 
    <!-- <LoadingSkeletonVue /> -->
  </div>
</template>