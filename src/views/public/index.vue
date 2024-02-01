<template>
  <div>
    <Header/>
    <section class="c">
      <div class="h1">高效的图像文件压缩</div>
      <div class="desc">
        为网站所有者、开发人员和设计人员量身定制的解决方案，确保每个项目的最佳网站性能。发现更快的加载时间与我们的图像优化工具的优势。
      </div>

      <div class="upload">
        <n-upload
            multiple
            directory-dnd
            :action="uploadApi"
            :show-file-list="false"
            @finish="onUploadFinish"
            @beforeUpload="onBeforeUpload"
            @error="onUploadError"
            response-type="json"
            method="post"
            :data="{quality:75, compression:9}"
            :headers="uploadRequestHeaders"
            :max="10">
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="72" :depth="1">
                <CloudUploadFilled/>
              </n-icon>
            </div>
            <n-text style="font-size: 16px">
              点击或者拖动文件到该区域来上传
            </n-text>
            <n-p depth="3" style="margin: 8px 0 0 0">
              请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
            </n-p>
          </n-upload-dragger>
        </n-upload>

        <n-flex class="options-container" align="center">
          <n-flex>转换格式：</n-flex>
          <n-flex class="options" justify="flex-end">
            <n-tag class="cursor" round :bordered="false" v-for="option in optionTypes"
                   :type="option.checked?'success':''"
                   @click="onTypeOptionCheck(option)">
              {{ option.name }}
              <template #icon>
                <n-icon>
                  <CheckCircleRound v-if="option.checked"/>
                  <RadioButtonUncheckedRound v-else/>
                </n-icon>
              </template>
            </n-tag>
          </n-flex>
        </n-flex>

        <div class="upload-list" v-if="processFiles.length > 0">
          <n-flex class="summary" justify="space-between">
            <n-flex>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-flex class="percent">
                    <n-icon class="icon" color="green" size="48">
                      <CheckRound/>
                    </n-icon>
                    {{ uploadSummary.shrinkPercent }}%
                  </n-flex>
                </template>
                压缩率：（压缩后文件大小 / 源文件大小）* 100
              </n-tooltip>
              <n-flex vertical justify="center" :size="[0,0]">
                <div>当前处理 <b>{{ uploadSummary.fileCount }}</b> 个文件，共节省流量：</div>
                <div>
                  {{ format.formatBytes(uploadSummary.totalSize - uploadSummary.shrinkSize) }}
                </div>
              </n-flex>
            </n-flex>
            <n-flex class="summary-right" align="center">
              <n-flex align="center">下载全部</n-flex>
              <n-icon size="50" color="#18a058" class="cursor" @click="downloadArchiveFile()">
                <CloudDownloadOutlined/>
              </n-icon>
            </n-flex>
          </n-flex>
          <n-flex class="item-container">
            <n-flex class="item" v-for="uploadFile in processFiles" vertical>
              <n-flex justify="space-between">
                <n-flex>
                  <n-image class="img" :src="previewImageFile(uploadFile.file)" object-fit="cover" width="55"
                           height="55"/>
                  <n-flex vertical :size="[0,0]" justify="center">
                    <span class="file-name">{{ uploadFile.name }}</span>
                    <span class="file-size">{{ format.formatBytes(uploadFile.file.size) }}</span>
                  </n-flex>
                </n-flex>
                <n-flex style="align-content: space-around">
                  <n-flex v-if="uploadFile.result.error" :size="[0,0]">
                    <n-flex class="result" vertical :size="[0,0]" justify="center">
                      <n-ellipsis>
                        {{ uploadFile.result.error }}
                      </n-ellipsis>
                    </n-flex>
                    <n-icon size="50" color="#d03050">
                      <ErrorOutlineOutlined/>
                    </n-icon>
                  </n-flex>
                  <n-flex v-else>
                    <n-flex class="result" vertical :size="[0,0]" justify="center">
                      <n-flex align="center" :size="[0,0]" class="file-percent-new">
                        <n-icon :depth="1">
                          <UnfoldLessRound/>
                        </n-icon>
                        <div v-if="uploadFile.result.rate>=100">+{{ 100 - uploadFile.result.rate }}%</div>
                        <div v-else>-{{ +uploadFile.result.rate }}%</div>
                      </n-flex>
                      <div class="file-size-new">{{ format.formatBytes(uploadFile.result.size) }}</div>
                    </n-flex>
                    <n-flex vertical :size="[0,0]" justify="center" align="center">
                      <n-icon size="36" color="#18a058" class="cursor"
                              @click="downloadFile(uploadFile.result.url, uploadFile.name)">
                        <CloudDownloadOutlined/>
                      </n-icon>
                      <b>{{ uploadFile.destOption.name || '' }}</b>
                    </n-flex>
                  </n-flex>
                </n-flex>
              </n-flex>
              <n-progress type="line" :show-indicator="false" v-if="uploadFile.result.error" status="error"
                          :percentage="uploadFile.percentage"/>
              <n-progress type="line" :show-indicator="false" v-else status="success"
                          :percentage="uploadFile.percentage"/>
            </n-flex>
          </n-flex>
        </div>

      </div>
    </section>

    <ModalWaitingComponent ref="refModalWaiting"/>
    <ModalTipsComponent ref="refModalTips"/>
  </div>
</template>

<script>
import {defineComponent, onBeforeMount, ref} from "vue";
import Header from "@/views/public/header.vue";
import ModalWaitingComponent from "@/components/ModalWaitingComponent.vue";
import ModalTipsComponent from "@/components/ModalTipsComponent.vue";

import {
  CheckCircleRound,
  CheckRound,
  CloudDownloadOutlined,
  CloudUploadFilled,
  ErrorOutlineOutlined,
  FolderZipFilled,
  RadioButtonUncheckedRound,
  UnfoldLessRound,
} from "@vicons/material";
import format from '@/utils/format.js'
import api from "@/api/index.js";
import localstorage from "@/utils/localstorage.js";

const refModalWaiting = ref(null)
const refModalTips = ref(null)
const uploadSummary = ref({
  fileCount: 0,
  totalSize: 0,
  shrinkSize: 0,
  shrinkPercent: 0,
})
const optionTypes = ref([
  {name: 'RAW', value: 'raw', checked: true},
  {name: 'WEBP', value: 'webp', checked: false},
  {name: 'JPG', value: 'jpg', checked: false},
  {name: 'PNG', value: 'png', checked: false}
])
const uploadedFiles = ref([])
const processFiles = ref([])

const onBeforeUpload = (options) => {
  refModalWaiting.value.showModal()
}

const getUploadSummaryPercent = (uploadSummary) => {
  const a = (100 * uploadSummary.shrinkSize / uploadSummary.totalSize).toFixed(1)
  if (!a) {
    return 0
  }
  return a
}

const onUploadFinish = (options) => {
  refModalWaiting.value.closeModal()

  const file = options.file
  const resp = options.event.target.response
  if (!resp || resp.code !== 200 || !resp.data.path) {
    return
  }

  uploadedFiles.value.push(options.file)

  optionTypes.value.forEach(item => {
    if (!item.checked) {
      return
    }
    // 添加处理文件
    let tmpFile = Object.assign({}, options.file, {result: {}, destOption: item,})
    tmpFile.id = `${tmpFile.id}_${item.value}`
    processFiles.value.push(tmpFile)
    // 更新全局统计
    uploadSummary.value.fileCount += 1
    uploadSummary.value.totalSize += tmpFile.file.size
    // 循环处理
    api.CompressProcess({src: resp.data.path, format: item.value}).then(resp => {
      console.log('[api.CompressProcessResp]', resp)
      // 更新处理结果（成功）
      processFiles.value = processFiles.value.map(item => {
        if (item.id === tmpFile.id) {
          item.percentage = tmpFile.percentage
          item.status = tmpFile.status
          item.result = resp.data.data

          uploadSummary.value.shrinkSize += item.result.size
          uploadSummary.value.shrinkPercent = getUploadSummaryPercent(uploadSummary.value)
        }
        return item
      })
    }).catch(err => {
      console.log('[api.CompressProcessError]', err)
      // 更新处理结果（失败）
      processFiles.value = processFiles.value.map(item => {
        if (item.id === tmpFile.id) {
          item.percentage = tmpFile.percentage
          item.status = tmpFile.status
          item.result = {}

          uploadSummary.value.shrinkSize += 0
          uploadSummary.value.shrinkPercent = getUploadSummaryPercent(uploadSummary.value)
        }
        return item
      })
    })
  })
}

const onUploadError = (options) => {
  refModalWaiting.value.closeModal()
}

const previewImageFile = (file) => {
  try {
    return URL.createObjectURL(file);
  } catch (e) {
    return null
  }
}

const onBeforeMountHandler = () => {
}

const downloadFile = (url, filename) => {
  window.open(`${url}?download&filename=${filename}`, '_blank')
}

const downloadArchiveFile = () => {
  let fileCount = 0
  const files = processFiles.value.map(item => {
    if (item.result && item.result.path) {
      fileCount++
    }
    const tmpResult = item.result ?? {}
    return {
      path: tmpResult.path,
      name: item.name,
    }
  })
  if (fileCount <= 0) {
    refModalTips.value.showError({'message': '没有可用文件'})
    refModalWaiting.value.closeModal()
    return
  }

  refModalWaiting.value.showModal()

  api.FileZipArchive({files: files}, {responseType: 'blob'}).then(resp => {
    try {
      // 获取文件名
      let filename = resp.headers.get('Content-Disposition').split('filename=')[1];
      filename = filename.trim().replace(/["']/g, ''); // 去除引号

      let url = window.URL.createObjectURL(resp.data)
      let eLink = document.createElement('a')
      eLink.href = url
      eLink.setAttribute('download', filename)
      document.body.appendChild(eLink)
      eLink.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(eLink)
    } catch (e) {
      console.log('[FileZipArchiveError]', e)
    }

  }).catch(err => {
    console.log('[FileZipArchiveErr]', err)
  }).finally(() => {
    refModalWaiting.value.closeModal()
  })

}

const uploadRequestHeaders = ref({
  Authorization: 'Bearer ' + localstorage.getAccessToken()
})

const onTypeOptionCheck = (option) => {
  optionTypes.value.map(item => {
    if (option && option.value === item.value) {
      item.checked = !item.checked
    }
    return item
  })
}

export default defineComponent({
  components: {
    Header, CloudUploadFilled,
    CloudDownloadOutlined, UnfoldLessRound,
    FolderZipFilled, CheckRound,
    ErrorOutlineOutlined,
    ModalWaitingComponent,
    ModalTipsComponent,
    CheckCircleRound,
    RadioButtonUncheckedRound,
  },
  setup() {
    const uploadApi = `${import.meta.env.VITE_BASE_URL}/upload?from=web_index`

    onBeforeMount(onBeforeMountHandler)

    return {
      uploadApi,
      onUploadFinish,
      onBeforeUpload,
      onUploadError,
      processFiles,
      previewImageFile,
      format,
      uploadSummary,
      downloadFile,
      downloadArchiveFile,
      refModalWaiting,
      refModalTips,
      uploadRequestHeaders,
      optionTypes,
      onTypeOptionCheck,
    }
  }
})
</script>

<style scoped>
.c {
  max-width: 980px;
  margin: 0 auto;
  padding: 120px 0 120px 0;

  .h1 {
    font-size: 48px;
    line-height: 200%;
  }

  .desc {
    font-size: 22px;
    line-height: 200%;
    color: rgba(64, 68, 79, 0.85);
  }

  .upload {
    margin: 80px 0 0 0;
  }

  .cursor {
    cursor: pointer;
  }

  .options-container {
    margin: 20px 0 10px 0;

    .options {
    }
  }


  .upload-list {
    margin: 20px 0 0 0;

    .summary {
      background-color: #0080001f;
      padding: 0 20px 0 20px;
      height: 80px;
      border-radius: 8px;

      .summary-right {
        color: #566675;
      }

      .percent {
        font-size: 32px;
        line-height: 80px;
        margin-right: 6px;

        .icon {
          line-height: 94px;
        }
      }
    }

    .item-container {
      margin: 10px 0 10px 0;
    }


    .item {
      padding: 10px 20px 10px 20px;
      width: 100%;
      border-radius: 8px;

      .img {
        width: 55px;
        height: 55px;
        border-radius: 5px;
        border: 1px dashed #e0dfdf;
      }

      .file-name {
        font-weight: bold;
        font-size: 16px;
      }

      .file-size {
        color: rgb(118, 124, 130);;
      }

      .result {
        width: 200px;
        margin-right: 16px;
        align-items: end;

        .file-percent-new {
          font-size: 16px;
          font-weight: bold;
        }

        .file-size-new {
          color: rgb(118, 124, 130);;
        }
      }
    }

    .item:hover {
      background-color: #0080001f;
    }
  }

}
</style>