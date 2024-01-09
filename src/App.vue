<script>
import {defineComponent} from 'vue'
import {NMessageProvider} from "naive-ui";

export default defineComponent({
  components: {NMessageProvider},
})

</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
      <RouterView/>
    </n-dialog-provider>
  </n-message-provider>
</template>

<style>

body {
  margin: 0;
  padding: 0;
  font-family: "Source Code Pro", Manrope, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Segoe UI", "Helvetica Neue", sans-serif;
}
</style>
