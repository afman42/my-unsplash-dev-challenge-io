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
        },
        modelValue: String
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
    <div class="flex flex-row justify-between mb-4">
        <div class="flex flex-row items-center">
            <img :src="myUnsplash" />
            <div class="border-2 border-gray-300 flex flex-row rounded-lg items-center" style="padding:8px;">
                <Icon icon="mdi:magnify" style="font-size:18px;color:#BDBDBD;"  />
                <input :value="modelValue" @input="$emit('update:modelValue', $event?.target?.value)" class="border-none outline-none font-noto-sans font-medium" style="margin-left: 5px; font-size:14px;" placeholder="Search By Name" />
            </div>
        </div>
        <Button @click="showModal(true)" class="text-white bg-green-500 px-2 btn-lg rounded-lg hover:border-2 hover:border-green-500 hover:bg-[#FFF] hover:text-black" text-button="Add a photo" />
    </div>
</template>