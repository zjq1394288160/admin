<template>
    <div class='userEdit'>
        <div class='userEdit-header'>
            <h1>用户资料页面</h1>
        </div> 
        <Form ref="formData" :model="formData" :rules="formData" :label-width="80">
            <div class='formEdit'>
                    <Card class='profile-content'>
                        <div class="avatar">
                            <img :src="formData.avatar" alt="">
                        </div>
                         <Button type="dashed" @click='editavatarModel'  class='editAvatar'>编辑头像</Button>
                        <div class='editVip'>
                            <div class='vip'><strong>vip特权</strong></div>
                            <InputNumber :max="10" :min="0" v-model="formData.vip"></InputNumber>
                        </div>
                        <FormItem label="姓名" prop="username">
                            <Input v-model="formData.username" placeholder="请输入中文名字"></Input>
                        </FormItem>
                        <FormItem label="密码" prop="password">
                            <Input v-model="formData.password" placeholder="请输入密码"></Input>
                        </FormItem>
                        <FormItem label="确定密码" prop="salt">
                            <Input v-model="formData.salt" placeholder="请确认密码"></Input>
                        </FormItem>
                    </Card>
                     <Card class='card'>
                        <div class="card-header">
                            <h2 class='title'>编辑个人资料</h2>
                            <p class='title-p'>完成你的个人资料</p>
                        </div>
                        <div class='card-content'>
                            <FormItem label="昵称" prop="nickname" >
                                <Input v-model="formData.nickname" placeholder="请输入您的昵称"></Input>
                            </FormItem>
                            <FormItem label="手机号" prop='phone'>
                                <Input v-model="formData.phone" placeholder="请输入您的手机号"></Input>
                            </FormItem>
                            <FormItem label="邮箱" prop="email">
                                <Input v-model="formData.email" placeholder="请输入您的邮箱"></Input>
                            </FormItem>
                            <FormItem label="籍贯">
                                <Input v-model="formData.address" placeholder="请输入您的籍贯"></Input>
                            </FormItem>
                            <div class='birthday'>
                                <span style='fontSize:16px;paddingRight:10px'>出生日期</span>
                                <DatePicker type="date" placeholder="Select date" v-model="formData.birthday"></DatePicker>
                            </div>
                             <FormItem label="性别">
                                <RadioGroup v-model="formData.sex">
                                    <Radio label="男">男</Radio>
                                    <Radio label="女">女</Radio>
                                    <Radio label="未知">未知</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="角色">
                                <CheckboxGroup v-model="formData.roles">
                                    <Checkbox label="无角色"></Checkbox>
                                    <Checkbox label="undefined"></Checkbox>
                                    <Checkbox label="Run"></Checkbox>
                                    <Checkbox label="空"></Checkbox>
                                </CheckboxGroup>
                            </FormItem> 
                             <FormItem label="个性签名" prop='signature'>
                                <Input v-model="formData.signature" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="编辑您的个性签名"></Input>
                            </FormItem>
                            <div class="submitButton">
                                 <FormItem>
                                    <Button type="primary" @click="handleSubmit('formData')">Submit</Button>
                                    <Button type="ghost" @click="handleReset('formData')" style="margin-left: 8px">Reset</Button>
                                </FormItem>
                            </div>
                        </div>
                    </Card>
            </div>
             <Modal v-model="avatarModel" title="编辑" width='800px' 
            ok-text='裁剪'
             @on-ok="handlecrop"
             >
             <!--  @on-ok="modelonOk()" -->
                <Row class-name="image-editor">
                    <Col span='14' class="image-editor-con1">
                    <div class="cropper">
                        <img :src='option.cropedImg' id="cropimg" alt="">
                    </div>
                    </Col>
                    <Col span='9' class="image-editor-con1" offset='1'>
                    <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
                        <div id="preview1">
                            <img :src="option.preview" alt="">
                        </div>
                    </Row>
                    <div class="image-editor-con1-btn-con margin-top-10">
                        <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />
                        <label class="filelabel" for="fileinput1"><Icon type="image"></Icon>&nbsp;选择图片</label>
                        <!-- <span><Button @click="handlecrop" type="primary" icon="crop">裁剪</Button></span> -->
                    </div>
                    </Col>
                </Row>
            </Modal>
        </Form>
       
    </div>
</template>


<script>
    import Cropper from "cropperjs";
    import iview from "iview";
    import "cropperjs/dist/cropper.min.css";
    import {
        fetchUserList,
        removeUserInfo,
        fetchUserInfo,
        postNewUser,
        updateUserInfo
    } from "common/api/user";
    export default {
        components: {},
        data() {
            return {
                cropper: {},
                option: {
                    cropedImg: "",
                    preview: ""
                },
                avatarModel: false, // 头像编辑的model
                keepavatar: true, //保存头像
                // 是否为更新数据 （false 新建，true 更新）
                update: false,
                // 数据（每个模型的数据不同 ）
                // data: {},
                // 表单数据
                formData: {
                    username: "", // "type": "STRING",用户名
                    password: "", // "type": "STRING",密码
                    salt: "", //"type": "CHAR",密码盐
                    phone: "", //"type": "STRING",  手机号
                    email: "", //"type": "STRING", 邮箱
                    nickname: "", //"type": "STRING", 昵称
                    avatar: "../../asset/images/login_bg.jpg", //"type": "STRING", 头像地址
                    vip: 0, //"type": "INTEGER",VIP等级
                    sex: "", // "type": "ENUM",性别 未知 男 女
                    birthday: "", //"type": "STRING",生日
                    address: "", // "type": "STRING",省市县
                    signature: "", //"type": "STRING",个人签名
                    roles: [ //"type": "ARRAY",角色
                    ],
                }
            };
        },
        created() {
            this.option.cropedImg = this.formData.avatar;
            let id = this.$route.params.id;
            if (id >= 0) {
                fetchUserInfo(id).then(data => {
                    var arr = [];
                    for (var i = 0; i < data.roles.length; i++) {
                        arr.push(data.roles[i].replace(/(^\s*)|(\s*$)/g, ""));
                    }
                    data.roles = arr;
                    this.formData = data;
                    this.option.cropedImg = this.formData.avatar;
                });
            } else {
                this.formData = this.formData;
                location.hash = "#/user/create";
            }
        },
        methods: {
            //提交表单
            handleSubmit(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        let param = this.formData;
                        let id = this.$route.params.id;
                        param.birthday =
                            new Date(param.birthday).getTime() || new Data().getTime();
                        if (!id) {
                            // this.handleReset(this.formData)
                            postNewUser(param).then(data => {
                                this.$Message.success("创建成功!");
                            });
                        } else {
                            updateUserInfo(param).then(data => {
                                this.$Message.success("更新成功!");
                            });
                        }
                    } else {
                        this.$Message.error("Fail!");
                    }
                });
            },
            //重置表单
            handleReset(name) {
                // this.$refs[name].resetFields();
                this.formData = {};
            },
            editavatarModel() {
                this.avatarModel = true;
            },
            //头像的上传
            handleChange1(e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper.replace(reader.result);
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
            },
            handlecrop() {
                let file = this.cropper.getCroppedCanvas().toDataURL();
               this.option.preview = file; 
               this.formData.avatar =this.option.preview
               
               this.avatarModel = false;
            },
            modelonOK(){ 
                debugger;
                 this.formData.avatar =this.option.preview
                  this.avatarModel = false;
            },
            // 初始化数据
            initModalDate() {}
        },
        mounted() {
            let img = document.getElementById("cropimg");
            this.cropper = new Cropper(img, {
                dragMode: "move",
                // preview: '#preview1',
                restore: false,
                center: false,
                highlight: false,
                minContainerWidth: 462,
                minContainerHeight: 300,
                cropBoxMovable: false,
                toggleDragModeOnDblclick: false
            });
        }
    };
</script>

<style lang="less">
.clearfix:after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
}
.clearfix {
    zoom: 1;
}
.userEdit{
    .userEdit-header{
        border-bottom: 1px dotted #2D8CF0;
        margin-bottom: 70px;
        h1{
            padding-left:10px;
            color:#2D8CF0;
        }
    }
    .profile-content{
        margin-left:20px;
        width:390px;
        position: relative;
        float: left;
        .avatar{
            width: 130px;
            height: 130px;
            border:1px dotted #CCC;
            border-radius:50%;
            padding:3px;
            margin:-60px auto 128px;
            overflow: hidden;
            box-shadow:2px 2px 6px 1px #aaa;
            img{
                width: 100%;
                height: 100%;
                border-radius:50%;
            }
        }
        .editVip{
            margin-bottom:24px;
            position: absolute;
            right: 0;
            top:138px;
        }
        .editAvatar{
            position: absolute;
            top:100px;
            left:50%;
            margin-left:-40px;
        }
    }
    .card{
        // height:782px;
        margin-left:430px;
        .card-header{
            width: 80%;
            background: #2D8CF0;
            height: 83px;
            padding: 15px;
            margin:-36px auto 15px;
            border-radius: 3px;
            box-shadow: 2px 2px 3px #aaa;
            .title{
                margin-bottom:5px;
                color:#FFF;
            }
            .title-p{
                color:rgba(255, 255, 255, 0.62);;
            }
        }
        .card-content{
            padding-left: 44px;
            .ivu-form-item{
                height: 33px;zoom:1;
                z-index: 100;
            }
            .birthday{
                margin-bottom:24px;
            }
            .submitButton{
                margin-top:50px;
                padding-top:24px;
                border-top:1px solid #aaa; 
            }
        }
    }
}
//要覆盖的iview样式
.formEdit{
    .ivu-form-item{
        .ivu-form-item-label{
        font-size:16px; 
        }
    }
    .ivu-radio-group-item{
        font-size:14px; 
    }
   .ivu-checkbox-group-item{
       span{
           font-size:14px;
       }
   }
   .ivu-input{
       height: 36px;
       font-size: 16px;
   }
}
@media screen and (max-width: 996px) {
    .profile-content{
        height:700px;
    } 
}

.image-editor{
    .cropper{
        box-sizing: border-box;
        border: 1px solid #c3c3c3;
        width: 100%;
        height: 100%;
        img{
            max-height: 100%;
        }
    }
    .fileinput{
        display: none;
    }
    .filelabel{
        display: block;
        padding: 6px 15px;
        background: #2d8cf0;
        display: inline-block;
        border: 1px solid #2d8cf0;
        border-radius: 4px;
        cursor: pointer;
        color: white;
        font-size: 12px;
        text-align: center;
        transition: all .2s;
        &:hover{
            background: #5cadff;
            border: 1px solid #5cadff;
            transition: all .2s;
        }
    }
    &-con1{
        height: 300px;
        &-preview-con{
            width: 100% !important;
            height: 200px !important;
            border: 1px solid #c3c3c3;
            #preview1{
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        }
    }
}
</style>
