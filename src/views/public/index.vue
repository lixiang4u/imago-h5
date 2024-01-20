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
            action="https://www.example.com/v2/5e4bafc63100007100d8b70f"
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

        <div>上传结果：</div>

      </div>
    </section>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import Header from "@/views/public/header.vue";
import {CloudUploadFilled} from "@vicons/material";

const onUploadFinish = (options) => {
  console.log('[onUploadFinish]', options)
}

const onBeforeUpload = (options) => {
  console.log('[onBeforeUpload]', options)
}

const onUploadError = (options) => {
  console.log('[onUploadError]', options)
}


export default defineComponent({
  components: {
    Header, CloudUploadFilled
  },
  setup() {
    return {
      onUploadFinish,
      onBeforeUpload,
      onUploadError,
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

}
</style>