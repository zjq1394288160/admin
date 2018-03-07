<template>
    <!-- <div>短视频首页  管理推荐，排行等数据</div> -->
    <!-- <video src="http://video.yimwing.com/8fcd53b803134722b558a94fb7943545/da8893cbf385416c82b3d016e13552a6-5287d2089db37e62345123a1be272f8b.mp4"></video> -->
    <Card class='image-editor'>
        <Form ref="formData" :model="formData" :rules="formData" :label-width="80">
             <FormItem label="视频路径" >
                <Input v-model="formData.video_path" placeholder="Enter your name"></Input>
            </FormItem>
            <FormItem label="封面大图" >
                <Input v-model="formData.cover" placeholder="Enter your name"></Input>
            </FormItem>
            <FormItem label="视频缩略图" >
                <Input v-model="formData.thumbnail" placeholder="Enter your name"></Input>
            </FormItem>
            <!-- <DatePicker type="date" placeholder="Select date" v-model="formData.time"></DatePicker> -->
            <Row> 
                <Col :lg="10" :md="12" :sm="24" :xs="24">
                    <Card>
                        <!-- <div slot="title"> -->
                            <Row>
                                <Col span='11'>
                                    <FormItem label="房间" prop="room">
                                        <Input v-model="formData.room" placeholder="Enter your name"></Input>
                                    </FormItem>
                                </Col>
                                <Col span='10' offset='1' style='margin-bottom: 25px;'>
                                    <strong>vip</strong> 
                                    <InputNumber :max="10" :min="1" v-model="formData.vip"></InputNumber>
                                </Col>
                                 <Col span="12">
                                    <FormItem label="用户ID"  prop="uid">
                                        <Input v-model="formData.uid" placeholder="Enter your name"  style="font-size:'16px'"></Input>
                                    </FormItem>
                                    <FormItem label="活动ID" >
                                        <Input v-model="formData.actid" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="类型" >
                                        <Input v-model="formData.type" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    
                                    <FormItem label="热度">
                                        <Input v-model="formData.heat" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="点赞">
                                        <Input v-model="formData.real_like" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="波豆">
                                        <Input v-model="formData.bean" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="打赏">
                                        <Input v-model="formData.reward" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="价格">
                                        <Input v-model="formData.price" placeholder="Enter your name"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="标题" >
                                        <Input v-model="formData.title" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="标签" >
                                        <Input v-model="formData.label" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="用户类型" >
                                        <Input v-model="formData.usersort" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="浏览量">
                                        <Input v-model="formData.real_people" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="热门天数" prop="hot_days">
                                        <Input v-model="formData.hot_days" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="点赞次数">
                                        <Input v-model="formData.like" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="观看次数">
                                        <Input v-model="formData.look" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="分享次数">
                                        <Input v-model="formData.share_count" placeholder="Enter your name"></Input>
                                    </FormItem>
                                </Col>
                            <!-- <FormItem label="录制地址" >
                                <Input v-model="formData.address" placeholder="Enter your name"></Input>
                            </FormItem> -->
                            </Row>                          
                        <!-- </div> -->
                    </Card>
                </col>
                <Col :lg="12" :md="12" :sm="24" :xs="24">
                    <Card>
                        <Row>
                             <div class='cover'>
                                <img src="../../asset/images/cropper-test.png" alt="">
                            </div>
                            <Col style='float:left'>
                                    <Card>
                                        <Button type="dashed"  @click='editcover'>点击更改封面</Button>
                                    </Card>
                             </Col>
                        </Row>
                    </Card>
                </Col>
                
            </Row>
            
            <div class="image-editor-submit">   
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formData')">Submit</Button>
                    <Button type="ghost" @click="handleReset('formData')" style="margin-left: 8px">Reset</Button>
                </FormItem>
            </div>
        </Form>
        <Modal v-model="coverModel" title="编辑" width='800px'>
            <Row class-name="image-editor">
                <Col span='14' class="image-editor-con1">
                    <div class="cropper">
                        <img :src='option1.cropedImg' id="cropimg1" alt="">
                    </div>
                </Col>
                <Col span='9' class="image-editor-con1" offset='1'>
                    <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
                        
                        <div id="preview1">
                            <img :src="option1.preview" alt="">
                        </div>
                    </Row>
                    <div class="image-editor-con1-btn-con margin-top-10">
                        <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />
                        <label class="filelabel" for="fileinput1"><Icon type="image"></Icon>&nbsp;选择图片</label>
                        <span><Button @click="handlecrop1" type="primary" icon="crop">裁剪</Button></span>
                    </div>
                </Col>
            </Row>
        </Modal>
    </Card>
</template>

<script>
// import iview from 'iview';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import {fetchVideoInfo,updateVideoInfo,createVideoInfo} from "common/api/video";
    export default {
        name: 'videoShow',
        components: {},
        data() {
            return {
                coverModel:false,
                cropper1: {},
                option1: {
                    cropedImg: '',
                    preview:'',
                },
                formData: {
                    uid: null,
                    actid:null,
                    type: '',//类型
                    title: '',//标题
                    label: '',//标签
                    usersort: '',//用户类型
                    address:'',//地址
                    room: '',//房间
                    price: '',//价格
                    cover:''      
                },  
            };
        },
        methods: {
            handleSubmit(name) {
                 this.$refs[name].validate((valid) => {
                    if (valid) {
                        var params=this.formData;
                        if(  this.$route.params.id){
                            updateVideoInfo(params).then(data=>{
                                this.$Message.success('更新成功!');
                                this.formData={};
                            })
                        }else{
                            createVideoInfo(params).then(res=>{
                                this.$Message.success('创建成功!');
                                this.$router.push({
                                    name: 'video_list'
                                });
                            })
                        }
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.formData={};
            },
            handleChange1 (e) {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper1.replace(reader.result);
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
            },
            handlecrop1 () {
                let file = this.cropper1.getCroppedCanvas().toDataURL();
                this.formData.cover = file;
                this.option1.preview=file;
            },
            //更改封面
            editcover(){
                this.coverModel=true;
                
            } 
        },
        mounted () {
            let img1 = document.getElementById('cropimg1');
            this.cropper1 = new Cropper(img1, {
                dragMode: 'move',
                // preview: '#preview',
                restore: false,
                center: false,
                highlight: false,
                cropBoxMovable: false,
                toggleDragModeOnDblclick: false,
                 minContainerWidth: 462,
                minContainerHeight: 300,
            });
        },
        created(){
            let id = this.$route.params.id;
           this.option1.cropedImg=this.formData.cover;
            if (id >= 0) {
                fetchVideoInfo(id).then(data => {
                    for(var key in  data){
                        if(typeof data[key]=="number"&&key!="vip"){
                            data[key]=data[key].toString();
                        }  
                    }
                    this.formData = data;
                   this.option1.cropedImg=this.formData.cover;
                });
            }
        }
    };
</script>

<style lang="less" scoped>
.demo-upload-list{
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
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
            #preview{
                width: 100%;
                height: 100%;
                // overflow: hidden;
                text-align: center;
                display: flex;
                align-items: center;
                
                img{
                    // max-height: 100%;
                    max-width: 100%;
                }
            }
        }
    }
 }
 .image-editor-submit{
     margin-top:30px;
 }
</style>
