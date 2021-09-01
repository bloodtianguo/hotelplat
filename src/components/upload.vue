<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="ITEMS_UP_IMG"
      :show-file-list="false"
      :on-success="handleVideoSuccess"
      :on-error="uperror"
      :before-upload="beforeUploadImg"
    >
      <el-image class="avatar" v-if="imgUrl" :src="imgUrl" fit="contain">
       <div slot="error" class="image-slot">不支持预览PDF格式文件</div>
      </el-image>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <span slot="tip" class="el-upload__tip marginle10">支持格式：PDF、bmp、jpg，png大小不超过5MB</span>
    </el-upload>
  </div>
</template>

<script>
import { ITEMS_UP_IMG } from "@/utils/request_upload";
import { Success, Infos, Warning } from "@/utils/tools/message.js";
export default {
  data() {
    return {
      imgUrl: "",
      ITEMS_UP_IMG: ITEMS_UP_IMG
    };
  },
  methods: {
    // 上传成功时函数
    handleVideoSuccess(res, file) {
      if (res.code == "0") {
        this.imgUrl = res.data;
        this.ESpass();
        Success("上传图片成功!");
      } else {
        this.$message.error("图片上传失败!");
      }
    },
    // 上传前函数
    beforeUploadImg(file) {
      const isImage =
        ["image/png", "image/jpg","image/jpeg", "application/pdf", "image/bmp"].indexOf(
          file.type
        ) == -1;
        const isLt2M = file.size / 1024 / 1024 < 5;
      if (isImage==true) {
        this.$message.error("只支持上传PDF、bmp、jpg，png格式!");
        this.fileList = [];
      }
       if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
      return !isImage && isLt2M;
    },
    uperror(err, file, fileList) {
      this.$message.error("图片上传失败!");
    },
    // 点击向父级传值
    ESpass() {
      this.$emit("getimgUrl", this.imgUrl);
    },
    clear(){
      this.imgUrl=""
    }
  }
};
</script>

<style lang="scss" scoped>
.el-upload {
  display: block;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
::v-deep .avatar {
  height: 178px;
  display: block;
}
::v-deep .image-slot{
    line-height: 178px;
}
</style>
