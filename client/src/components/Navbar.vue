<script lang="ts">
import MyUnsplash from "../assets/my_unsplash_logo.svg"
import Button from "./Button.vue";
import { Icon } from '@iconify/vue';
export default {
    name: "Navbar",
    props: {
        showModal: {
            required: true,
            type: Function
        }
    },
    components: {
        Button,
        Icon
    },
    setup(){
        const myUnsplash = MyUnsplash
        return {
            myUnsplash
        }
    }
}
</script>

<template>
    <div class="flex flex-row justify-between">
        <div class="flex flex-row items-center">
            <img :src="myUnsplash" />
            <div class="border-black flex flex-row rounded-lg items-center" style="padding:8px;">
                <Icon icon="mdi:magnify" style="font-size:18px;color:#BDBDBD;"  />
                <input class="border-none outline-none font-noto-sans font-medium" style="margin-left: 5px; font-size:14px;" placeholder="Search By Name" />
            </div>
        </div>
        <Button @click="showModal(true)" class="text-white bg-green border-none btn-lg rounded-lg border-green" text-button="Add a photo" />
    </div>
</template>