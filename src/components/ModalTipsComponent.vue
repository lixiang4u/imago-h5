<template>
  <n-modal v-model:show="modalConfig.show" :on-mask-click="onModalClose">
    <n-card
        style="width: 600px"
        title="提示"
        preset="dialog"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra></template>
      {{ modalConfig.message }}
      <template #footer></template>
      <template #header>
        <div class="head-title">
          <div class="vcenter">
            <n-icon class="icon" :class="modalConfig.color" size="32" :component="ErrorFilled"/>
            {{ modalConfig.title }}
          </div>
          <div class="vcenter">
            <n-icon class="icon cursor" @click="onModalClose" size="32" :component="CloseRound"/>
          </div>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script>

import {defineComponent, ref} from 'vue'
import ErrorFilled from "@vicons/material/ErrorFilled";
import CloseRound from "@vicons/material/CloseRound";

const modalConfig = ref({
  show: false,
  color: null,
  timeout: null,
  title: null,
  message: null,
  defaultConfig: {timeout: 3e3, color: 'default', title: '提示', message: '无消息'},
})

const countdown = () => {
  if (modalConfig.value.timeout <= 0) {
    modalConfig.value.show = false
  } else {
    modalConfig.value.timeout -= 1e3;
    setTimeout(countdown, 1e3)
  }
}

const showModal = (config) => {
  for (const configKey in modalConfig.value.defaultConfig) {
    modalConfig.value[configKey] = modalConfig.value.defaultConfig[configKey]
  }
  if (config) {
    const keys = ['color', 'timeout', 'title', 'message',]
    for (const key in keys) {
      if (config.hasOwnProperty(keys[key])) {
        modalConfig.value[keys[key]] = config[keys[key]]
      }
    }
  }
  modalConfig.value.show = true
  countdown()
}

const showSuccess = (config) => {
  config = Object.assign(config ?? {}, {'color': 'success'})
  showModal(config)
}
const showError = (config) => {
  config = Object.assign(config ?? {}, {'color': 'error'})
  showModal(config)
}
const showWarning = (config) => {
  config = Object.assign(config ?? {}, {'color': 'warning'})
  showModal(config)
}

const onModalClose = () => {
  modalConfig.value.show = false
  modalConfig.value.timeout = 0
}

export default defineComponent({
  components: {
    ErrorFilled,
    CloseRound,
  },
  setup() {
    return {
      ErrorFilled, CloseRound,
      modalConfig,
      showModal,
      showSuccess,
      showError,
      showWarning,
      onModalClose,
    }
  }
})

</script>

<style scoped>

.head-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .default {
  }

  .primary {
    color: #18a058;
  }

  .success {
    color: #18a058;
  }

  .warning {
    color: #f0a020;
  }

  .error {
    color: #d03050;
  }

  .vcenter {
    display: flex;
    flex-direction: row;
    align-items: center;

    .icon {
      margin: 0 10px 0 -6px;
    }

    .cursor {
      cursor: pointer;
    }
  }
}

</style>