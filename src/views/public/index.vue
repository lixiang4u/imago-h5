<template>
  <div>
    <HomeIndexMobileComponent v-if="isMobile"/>
    <HomeIndexComponent v-else/>
  </div>
</template>

<script>
import {defineComponent, onBeforeMount} from "vue";
import HomeIndexComponent from "@/components/HomeIndexComponent.vue";
import HomeIndexMobileComponent from "@/components/HomeIndexMobileComponent.vue";
import {isMobile} from "vue-device-detect";

const onBeforeMountHandler = () => {
}

export default defineComponent({
  components: {
    HomeIndexComponent, HomeIndexMobileComponent,
  },
  setup() {
    onBeforeMount(onBeforeMountHandler)
    return {
      isMobile,
    }
  }
})
</script>

<style scoped>
</style>