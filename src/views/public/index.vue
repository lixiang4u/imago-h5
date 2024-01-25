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
        <div class="upload-list">
          <n-flex class="summary" justify="space-between">
            <n-flex>
              <n-flex class="percent">
                <n-icon class="icon" color="green" size="48">
                  <CheckRound/>
                </n-icon>
                19%
              </n-flex>
              <n-flex vertical justify="center" :size="[0,0]">
                <div>当前处理5个文件，共节省流量：</div>
                <div>34.4KB</div>
              </n-flex>
            </n-flex>
            <n-flex class="summary-right">
              XX
            </n-flex>
          </n-flex>
          <n-flex class="item-container">
            <n-flex class="item" v-for="uploadFile in uploadFiles" vertical>
              <n-flex justify="space-between">
                <n-flex>
                  <n-image class="img" :src="previewImageFile(uploadFile.file)"/>
                  <n-flex vertical :size="[0,0]" justify="center">
                    <span class="file-name">{{ uploadFile.name }}</span>
                    <span class="file-size">{{ format.formatBytes(uploadFile.file.size) }}</span>
                  </n-flex>
                </n-flex>
                <n-flex style="align-content: space-around">
                  <n-flex class="result" vertical :size="[0,0]" justify="center">
                    <n-flex align="center" :size="[0,0]" class="file-percent-new">
                      <n-icon :depth="1">
                        <UnfoldLessRound/>
                      </n-icon>
                      <span>-60%</span>
                    </n-flex>
                    <div class="file-size-new">{{ format.formatBytes(uploadFile.file.size) }}</div>
                  </n-flex>
                  <n-icon size="50" color="#18a058" class="cursor">
                    <CloudDownloadOutlined/>
                  </n-icon>
                </n-flex>
              </n-flex>
              <n-progress type="line" :show-indicator="false" status="success" :percentage="20"/>
            </n-flex>
          </n-flex>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import {defineComponent, onBeforeMount, ref} from "vue";
import Header from "@/views/public/header.vue";
import {CheckRound, CloudDownloadOutlined, CloudUploadFilled, FolderZipFilled, UnfoldLessRound} from "@vicons/material";
import format from '@/utils/format.js'
import localstorage from "@/utils/localstorage.js";

const uploadFiles = ref([{
  file: {
    size: 122434,
  },
  name: 'xxxxx.png',
}, {
  file: {
    size: 676577,
  },
  name: 'yyyyyyy.png',
}, {
  file: {
    size: 6765546,
  },
  name: 'zzzzzzz.png',
}])

const onBeforeUpload = (options) => {
  console.log('[onBeforeUpload]', options)
  const find = uploadFiles.value.find(item => {
    return item.id === options.file.id
  })
  console.log('[=============>find]', find, uploadFiles.value)
  if (!find) {
    uploadFiles.value.push(options.file)
  }

}

const onUploadFinish = (options) => {
  console.log('[onUploadFinish]', options)
}

const onUploadError = (options) => {
  console.log('[onUploadError]', options)
}

const previewImageFile = (file) => {
  try {
    return URL.createObjectURL(file);
  } catch (e) {
    return null
  }
}

const onBeforeMountHandler = () => {
  localstorage.get
}

export default defineComponent({
  components: {
    Header, CloudUploadFilled, CloudDownloadOutlined, UnfoldLessRound, FolderZipFilled, CheckRound
  },
  setup() {
    const uploadApi = `${import.meta.env.VITE_BASE_URL}/shrink?from=web_index`
    console.log('[uploadApi]', uploadApi)

    onBeforeMount(onBeforeMountHandler)

    return {
      uploadApi,
      onUploadFinish,
      onBeforeUpload,
      onUploadError,
      uploadFiles,
      previewImageFile,
      format,
    }
  }
})
</script>

<style scoped>
.c {
  width: 900px;
  margin: 0 auto;
  padding: 120px;

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

  .upload-list {
    margin: 20px 0 0 0;

    .summary {
      background-color: #0080001f;
      padding: 0 20px 0 20px;
      height: 80px;
      border-radius: 8px;

      .percent {
        font-size: 32px;
        line-height: 80px;

        .icon {
          line-height: 94px;
          //margin: 10px 0 0 0;
        }
      }
    }

    .item-container {
      //margin: 10px 0 10px 0;
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
        width: 80px;
        margin-right: 10px;

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
      //background-color: #f8f8f8;
      background-color: #0080001f;
    }
  }

}
</style>