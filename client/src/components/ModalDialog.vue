<template> 
    <teleport to="body"> 
      <transition 
        enter-active-class="transition ease-out duration-200 transform" 
        enter-from-class="opacity-0" 
        enter-to-class="opacity-100" 
        leave-active-class="transition ease-in duration-200 transform" 
        leave-from-class="opacity-100" 
        leave-to-class="opacity-0" 
      > 
        <div 
          ref="modal-backdrop" 
          class="fixed z-10 inset-0 overflow-y-auto bg-black-transparent" 
          v-show="show" 
        > 
          <div 
            class="flex items-center justify-center min-h-screen pt-24" 
          > 
            <transition 
              enter-active-class="transition ease-out duration-300 transform " 
              enter-from-class="opacity-0 translate-y-10 scale-95" 
              enter-to-class="opacity-100 translate-y-0 scale-100" 
              leave-active-class="ease-in duration-200" 
              leave-from-class="opacity-100 translate-y-0 scale-100" 
              leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95" 
            > 
            <div 
                role="dialog" 
                class="relative bg-white flex flex-col rounded-lg overflow-hidden shadow-xl w-50"
                style="padding:10px 20px;" 
                ref="modal" 
                aria-modal="true" 
                v-show="show" 
                aria-labelledby="modal-headline" 
              > 
                  <slot name="header"></slot>
                  <main>
                    <slot></slot>
                  </main>
                  <footer class="flex justify-end my-20">
                    <slot name="footer"></slot>
                  </footer> 
              </div> 
            </transition> 
          </div> 
        </div> 
      </transition> 
    </teleport> 
</template> 
   
<script lang="ts"> 
import { watch, ref } from 'vue'; 
import { Icon } from '@iconify/vue';
import { onClickOutside } from '@vueuse/core'

const props = { 
    show: { 
      type: Boolean, 
      default: false, 
    }, 
}; 
   
const components = { 
    Icon, 
}; 
   
export default { 
    name: 'ModalDialog',
    props, 
    components, 
    emits:["close"],
    setup(props, { emit }) {
        const modal = ref(null)
        const showModal = ref(false);   
   
        function closeModal() { 
          emit('close'); 
        } 
    
        onClickOutside(modal, () => { 
          if (showModal.value === true) { 
            closeModal();
          }
        });
    
        watch( 
          () => props.show, 
          show => { 
            showModal.value = !!show 
          }, 
        ); 
   
      return { 
        closeModal, 
        showModal, 
        modal,
      }; 
    }, 
}; 
</script> 
   