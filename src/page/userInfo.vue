<template>
    <div>
        <head-top></head-top>
            <el-card style="height: 720px;margin: 0 auto;line-height: 400%">
                <p style="font-size: 30px;text-align: center;margin-bottom: 30px">::   {{username}} 的个人信息   ::</p>
<!--                <el-button @click="dialogFormVisible = true"  type="primary" style="margin-left:50px">修改密码</el-button>-->
                <el-divider></el-divider>
                <br>
                <el-row>
                    <el-col :span="2" :offset="2"><span style="font-size: 20px;">权限:</span></el-col>
                    <el-input
                        v-model="root"
                        :disabled="true"
                        style="width:60%;"
                    >
                    </el-input>
                </el-row>
                <el-row>
                    <el-col :span="2" :offset="2"><span style="font-size: 20px;">说明:</span></el-col>
                    <el-input
                        type="textarea"
                        :rows="4"
                        resize="none"
                        placeholder="请输入内容"
                        v-model="desc"
                        style="width: 60%;height: 45px">
                    </el-input>
                </el-row>
                <br>
                <el-row>
                    <el-col :span="2" :offset="2"><span style="font-size: 20px;">权限树:</span></el-col>
                    <div>
                    <el-scrollbar class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false" :onresize="true">
                    <el-tree
                    :data="tree"
                    :props="defaultProps"
                    node-key="id"
                    default-expand-all
                    ref="tree"
                    >

                    </el-tree>
                    </el-scrollbar>
                    </div>

                </el-row>
                <br>
                <el-row>
                    <el-col :span="2" :offset="2">
                        <el-button @click="commit"  type="primary" style="margin-top: 20px">保存</el-button>
                        </el-col>
                </el-row>



                <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :append-to-body="true">
                    <el-form :model="form">
                        <el-form-item label="旧密码" :label-width="wid">
                            <el-input v-model="form.oldPW" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" :label-width="wid">
                            <el-input v-model="form.newPW1" autocomplete="off" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="请再次输入新密码" :label-width="wid">
                            <el-input v-model="form.newPW2" autocomplete="off" show-password></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="commitPW">确 定</el-button>
                    </div>
                </el-dialog>

            </el-card>

    </div>

</template>

<script>
	import headTop from '../components/headTop';
	import {getAllTree,getOneTree,getUserInfo,changePassword,changeDetail} from '@/api/getData';

	export default {
		name: "userInfo",
		components: {
			headTop,
		},
        data() {
			return{
				tree:[],
                oneTree:[],
				defaultProps: {
					children: 'children',
					label: 'area_name',
					id:'id',
				},
				wid:'120',
                form:{
                	oldPW:'',
                    newPW1:'',
                    newPW2:''
                },
				dialogFormVisible:false,
				desc:"",
                root:"",
                username:"",
            }
        },
        methods:{
			commit(){
			    console.log("233");
				let param = new URLSearchParams();
				param.append('username',this.username);
				param.append('description',this.desc);
			    changeDetail(param).then(result =>{
			    	if(result.status===200){
						this.$message({
							type: 'success',
							message: '信息修改成功'
						});
                    }else{
						this.$message({
							type: 'fail',
							message: '信息修改失败，请检查网络或重新登陆'
						});
                    }
			    	console.log(result);
                });
			    // this.getUserInfo();
            },
			commitPW(){
			    let flag=true;
			    let self=this;
			    Object.keys(this.form).forEach(function(key){
                    if(self.form[key]===''){
                    	flag=false;return;
                    }
			});
			    if(!flag){//未输入
					this.$message({
						type: 'warning',
						message: '请输入密码'
					});
                }else{
			    	if(this.form.newPW1!==this.form.newPW2){
						this.$message({
							type: 'warning',
							message: '两次密码输入不相同,请重新输入'
						});
                    }else{
			    		if(this.form.oldPW===this.form.newPW1){
							this.$message({
								type: 'warning',
								message: '新密码不能与旧密码相同,请重新输入'
							});
                        }else{
							this.changePW(this.form.oldPW,this.form.newPW2);
                        }

                    }
                }
            },
			async getUserInfo(){
				const result=await getUserInfo();
				console.log(result);
				this.username=result.user.username;
				this.desc=result.user.description;
                this.root=result.user.roles[0].nameZh;
            },
            async changePW(old,nnew){
				console.log("PW");
				let param = new URLSearchParams();
				// param.append('username',this.username);
				param.append('password',old);
				param.append('newPassword',nnew);
				await changePassword(param);
            },
            async getTree(){
				//完整分区树
				const Tree=await getAllTree();
				this.tree=Tree;
				//权限树
				const One=await getOneTree();
				this.oneTree=One;
            },
		},
        mounted() {
			this.getUserInfo();
			this.getTree();

		}
	}
</script>

<style scoped>
    .default-scrollbar {
        width: 50%;
        height: 200px;
        overflow-x: hidden;


    }
    .default-scrollbar2 {
        width: 100%;
        height: 600px;
        overflow-x: hidden;
    }
    .el-scrollbar__wrap.default-scrollbar__wrap {
        overflow-x: auto;
    }
    .el-scrollbar__view.p20-scrollbar__view {
        padding: 20px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -o-box-sizing: border-box;
        -ms-box-sizing: border-box;
    }
</style>
