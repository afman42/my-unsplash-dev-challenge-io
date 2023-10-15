<script setup lang="ts">
import { apiGet, apiPostFetch, type IPhotos, apiDeleteFetch } from "./api";
import { Navbar, ModalDialog,Button, LoadingSkeleton  } from "./components";
import { ref, watch } from 'vue';
import { watchDebounced } from "@vueuse/core"

const showModal = ref(false);
const deleteModal = ref(false)
const querySearch = ref("")
const formInput = ref({
  label: "",
  photoUrl: ""
});
const formPassword = ref({
  password: "",
  id: 0,
});

let { isFetching, data: allData, isFinished } = apiGet()

watchDebounced(querySearch, async (newVal: string) => {
  let responseSearch = await apiGet(newVal).get().json()
  allData.value = responseSearch.data.value
  isFetching.value = responseSearch.isFetching.value
  isFinished.value = responseSearch.isFinished.value
}, { debounce: 500, maxWait: 1000 })

function showMyModal (bool: boolean) {
  showModal.value = bool
}

function deleteMyModal (bool: boolean) {
  deleteModal.value = bool
}

async function submitHandlerPost(e: Event) {
  e.preventDefault();
  const resSubmitHandlerPost = await apiPostFetch(formInput.value) as IPhotos
  if(resSubmitHandlerPost.data.value != null){
    allData.value = [...allData.value as Array<IPhotos>,resSubmitHandlerPost.data.value]
    allData.value = [...allData.value].sort((a: IPhotos, b: IPhotos) => b.id - a.id)
    showModal.value = false
    formInput.value = {
      label: "",
      photoUrl: ""
    }
  }
}

async function deleteHandler(e: Event) {
  e.preventDefault();
  const res = await apiDeleteFetch(formPassword.value.password,formPassword.value.id)
  if(res.data.value !== null){
    allData.value = [...allData.value as Array<IPhotos>].filter((v: IPhotos) => v.id !== formPassword.value.id)
    deleteModal.value = false
    formPassword.value.password = ""
    formPassword.value.id = 0
  }
}

</script>

<template>
  <div class="min-h-screen mx-8 my-4">
    <Navbar :show-modal="showMyModal" v-model="querySearch" />
    <template v-if="allData?.length == 0">
        <div class="flex min-h-screen justify-center items-center">
          <h1 class="font-noto-sans font-medium">Not Found</h1>
        </div>
      </template>
    <div class="mt-2 container gap-8 lg:columns-3 md:columns-2 sm:columns-1">
      <template v-if="isFinished && !isFetching">
        <div class="w-full flex mb-6" v-for="(item,index) in allData" :key="item.label">
          <img id="image" class="w-full rounded-lg" :class="[ 
            index == 0 ? 'aspect-video' : null, 
            item.id % 2 == 0 ? 'aspect-square' : null,
            allData?.length == index + 1 ? 'aspect-video' : null,
            index % 1 == 0 ? 'aspect-square' : null,
          ]" :src="item.photoUrl" />
          <div class="absolute flex flex-col" id="hover" style="padding:10px 10px;">
            <h4 style="color:black;margin-bottom: 10px;" class="font-medium font-noto-sans">{{ item.label }}</h4>
            <Button @click="deleteMyModal(true);formPassword.id = item.id;" class="border-gray-400 border-2 rounded-lg border-red" style="background-color: inherit;width:100px;" text-button="Delete it" />
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


      <div class="flex flex-col space-y-2">
        <label for="Label" class="font-noto-sans text-sm">Label</label>
        <input v-model="formInput.label" class="w-full border-gray-400 border-2 px-2 py-2 rounded-lg text-xs" placeholder="Fill it" />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="Photo URL" class="font-noto-sans text-sm">Photo URL</label>
        <input v-model="formInput.photoUrl" class="w-full border-gray-400 border-2 py-2 px-2 rounded-lg text-xs" placeholder="Fill it" />
      </div>

      <template v-slot:footer>
        <Button type="button" @click="showModal = false" class="border-none bg-white text-[#BDBD]" text-button="Cancel" />
        <Button @click="submitHandlerPost" class="text-white bg-green hover:border-green-500 hover:border-2 hover:bg-[#FFF] hover:text-black w-24 h-8 rounded-lg bg-green-500" style="margin-left: 10px;" text-button="Submit" />
      </template>
    </ModalDialog>
    <ModalDialog :show="deleteModal" @close="deleteModal = false;formPassword.id = 0; formPassword.password = ''"> 
      <template v-slot:header>
        <h1 class="font-noto-sans font-medium text-lg mb-4">Are you sure</h1>
      </template>

      <div class="flex flex-col space-y-2">
        <label for="Label" class="font-noto-sans text-md">Password</label>
        <input v-model="formPassword.password" class="w-full border-gray-400 border-2 py-2 px-2 rounded-lg text-xs" placeholder="**********" />
      </div>

      <template v-slot:footer>
        <Button type="button" @click="deleteModal = false; formPassword.id = 0;formPassword.password = '';" class="border-none bg-white text-gray" text-button="Cancel" />
        <Button type="button" @click="deleteHandler" class="text-white bg-red hover:border-2 hover:border-red-500 w-24 h-8 rounded-lg bg-red-500 hover:text-black hover:bg-white" style="margin-left: 10px;" text-button="Delete" />
      </template>
    </ModalDialog> 
    <!-- <LoadingSkeletonVue /> -->
  </div>
</template>
