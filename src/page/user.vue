<template>
    <div style="height: 100%">
        <head-top></head-top>

        <el-container style="margin-top: 20px">
            <el-header style="height: 60px; width:1000px">
                <div style="display: inline">
                    <el-button round type="primary"  icon="el-icon-plus" style="float:left" @click="addmeun"> 添加账户</el-button>
                    <el-button type="primary" icon="el-icon-search" style="float: right;" @click="search">搜索</el-button>
                    <el-input placeholder="搜索" clearable prefix-icon="el-icon-search"
                              style="width: 300px; float:right" v-model="keywords"></el-input>

                </div>
            </el-header>
            <el-main style="height: 100%;width: 100%">

                <el-table :data="users" v-loading="tableloading" border stripe
                          size="mini" style="width:1600px">
                    <el-table-column type="text" prop="username" align="center" fixed
                                     label="账户" width="100" ></el-table-column>
                    <el-table-column type="text" align="center"
                                     label="角色权限" width="100">
                        <template slot-scope="scope">
                            <div v-html="formatroles(scope.row.roles)"></div>
                        </template>
                    </el-table-column>

                    <el-table-column type="text" align="center" prop="areaname"
                                     label="所属区域" width="100">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="showAreaTree(scope.row.areaname)">查看</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column type="text" prop="description" align="center"
                                      label="说明" width="200"></el-table-column>
                    <el-table-column type="text"  align="center"
                                     fixed="right" label="操作" width="600">
                        <template slot-scope="scope">
                            <el-row>
                                <el-col :span="6">
                                    <el-button type="primary" size="small" @click="editmenu(scope.row)">修改信息</el-button>
                                </el-col>
                                <el-col :span="6" >
                                    <el-button type="primary" size="small" @click="showpower(scope.row)">权限分配</el-button>
                                </el-col>
                                <el-col :span="6">
                                    <el-button type="primary" size="small" @click="resetpwd(scope.row)">重置密码</el-button>
                                </el-col>
                                <el-col :span="6">
                                    <el-button type="primary" size="small" @click="makesure(scope.row)">删除账号</el-button>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                </el-table>

            </el-main>
            <el-footer >
                <label>{{"显示第 " + (1+(currentpage-1)*10)+ " 到第 " + ((currentpage)*10>num?num:(currentpage)*10) + " 条记录，总共 " + num + " 条记录"}}</label>
                <el-pagination
                    style="float: right"
                    background
                    layout="prev, pager, next"
                    :total="num" :page-size="10" :current-page.sync="currentpage" @current-change="loadusers">
                </el-pagination>
            </el-footer>
        </el-container>

        <el-form :model="user" style="margin: 0px;padding: 0px;">
            <div style="text-align: left">
                <el-dialog :title="editTitle"
                           style="padding: 0px;"
                           :close-on-click-modal="false"
                           :append-to-body="true"
                           :visible.sync="editVisible"
                           width="77%">
                    <el-row>
                        <el-col>
                            <div>
                                <el-form-item label="账户:" label-width="120px" label-position="right" prop="username" >
                                    <el-input disabled v-model="user.username"
                                              size="mini" style="width: 150px" ></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col>
                            <div>
                                <el-form-item label="说明:" label-width="120px" label-position="right" prop="description">
                                    <el-input prefix-icon="el-icon-edit" placeholder="请输入内容"
                                              size="mini" style="width: 500px" v-model="user.description"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="cancelEdit">取 消</el-button>
              <el-button size="mini" type="primary" @click="submitchange">确 定</el-button>
            </span>
                </el-dialog>
            </div>
        </el-form>

        <!--添加用户-->
        <div style="text-align: left;height: 100%">
                <el-dialog :title="editTitle"
                           style="padding: 0px;height: 100%"
                           :close-on-click-modal="false"
                           :visible.sync="addVisible"
                           :append-to-body="true"
                           width="77%">
                    <el-container style="height: 100%">
                        <el-aside style="height: 100%;width: 50%">
                            <el-form :model="user" style="margin: 0px;padding: 0px;height: 100%;">
                            <el-row>
                                <el-col>
                                    <div>
                                        <el-form-item label="账户:" label-width="120px" label-position="right" prop="username" >
                                            <el-input v-model="user.username" prefix-icon="el-icon-edit"
                                                      size="mini" style="width: 150px" ></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col>
                                    <div>
                                        <el-form-item label="说明:" label-width="120px" label-position="right" prop="description">
                                            <el-input prefix-icon="el-icon-edit" placeholder="请输入内容"
                                                      size="mini" style="width: 100%" v-model="user.description"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <div>
                                        <el-form-item label="角色:" label-width="120px" label-position="right">
                                            <el-radio-group v-model="selectroles">
                                                <el-radio border v-for="role in roles" v-if="$store.state.user.name == 'super'?true:(role == '管理员'?false:true) " :label="role" :key="role">{{ role }}</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            </el-form>
                        </el-aside>
                        <el-main style="height: 100%">
                            <el-header style="padding: 20px 20px 10px;background: #eeeeee;">
                                所属区域
                            </el-header>
                            <el-main>
                                <Area-Tree ref="treeadd" :change="false" :init="[]" :defa="[]"></Area-Tree>
                            </el-main>
                        </el-main>
                    </el-container>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="mini" @click="cancelEdit">取 消</el-button>
                        <el-button size="mini" type="primary" @click="addsubmit">确 定</el-button>
                    </span>
                </el-dialog>
            </div>

        <!--权限分配-->
        <div style="text-align: left;height: 100%">
            <el-dialog :title="editTitle"
                       style="padding: 0px;height: 100%"
                       :close-on-click-modal="false"
                       :visible.sync="powerVisible"
                       :append-to-body="true"
                       width="77%" @close="clearpower">
                <el-container style="height: 100%">
                    <el-aside style="height: 100%">
                        <el-header style="padding: 20px 20px 10px;background: #eeeeee;">
                            角色权限
                        </el-header>
                        <el-main>
                            <div>
                                <el-radio-group v-model="selectroles">
                                    <el-radio border v-for="role in roles" v-if="$store.state.user.name == 'super'?true:(role == '管理员'?false:true)" :label="role" :key="role">{{ role }}</el-radio>
                                </el-radio-group>
                            </div>
                        </el-main>
                    </el-aside>
                    <el-main style="padding-top: 0px">
                        <el-container>
                            <el-header style="padding: 20px 20px 10px;background: #eeeeee;">
                                所属区域
                            </el-header>
                            <el-main>
                                <Area-Tree ref="tree" :init="[]" :defa="treedefaultarea"></Area-Tree>
                            </el-main>
                        </el-container>

                    </el-main>

                </el-container>

                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="clearpower">取 消</el-button>
                    <el-button size="mini" type="primary" @click="submitpower">确 定</el-button>
                </span>
            </el-dialog>
        </div>

        <el-dialog :title="'管辖区域'"
                   style="padding: 0px;"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :visible.sync="AreaVisible"
                   width="50%">
                <AreaTree ref="showTree" :init="scopearea" :change="false"></AreaTree>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="AreaVisible = false">确定</el-button>
            </span>

        </el-dialog>

    </div>
</template>

<script>
	import search from '../components/Search.vue'
	import headTop from '../components/headTop';
	import {testUrl} from '../config/env'
	import {Message} from 'element-ui';
	import AreaTree from '../components/area.vue'
	export default {
		data(){
			return{
				// Host: 'http://139.9.198.72:8082',
				//Host: 'http://172.26.209.58:8082',
				Host: testUrl,
				tableloading: false,
				currentpage: 1,
				searchcurrentpage: 1,
				keywords: '',
				users: [],
				editTitle: '',
				editVisible: false,
				addVisible: false,
				powerVisible: false,
                AreaVisible: false,
				user: {
					username: '',
					editable: '禁止',
					description: '',
					enable: false
				},
                scopearea: [],
				power: [],
				roles: [],
				areas: [],
				selectroles: '',
				selectareas: [],
				choices: [],
				selectchoices: [],
				num: null,
				advanceSearchVisible: false,
				items: [{}],
                treedefaultarea:[],
			}
		},
		components:{
			search,headTop,AreaTree
		},
		mounted:function () {
			this.loadusers();
			this.getareas();
		},
		methods:{
			loadusers(){
				var _this = this;
				_this.tableloading = true;
				_this.$axios.get(this.Host+"/basic/users?page=" + _this.currentpage + "&size=10&keywords=" + _this.keywords)
					.then(resp => {
						console.log(resp)
						if(resp && resp.status==200){
							_this.tableloading = false;
							var data = resp.data;
							_this.users = data.users;
							_this.num = data.count;
							_this.roles=[];
							for(var each in data.roles){
								_this.roles.push(data.roles[each].nameZh)
							}
						}
					})
			},
			editmenu(row){
				this.editTitle = "修改信息";
				this.user.username = row.username;
				this.user.description = row.description;
				this.user.editable = row.editable;
				if(this.user.editable == '允许'){
					this.user.enable = true;
				}else if(this.user.editable == "禁止"){
					this.user.enable = false;
				}
				this.editVisible = true;
			},
			clearuser(){
				this.user = {
					username: '',
					editable: '禁止',
					description: '',
					enable: false
				}
			},
			cancelEdit(){
				this.editVisible = false;
				this.addVisible = false;
				this.$refs.treeadd.cleanCheckedNodes();
				this.clearuser();
			},
			submitchange(){
				var _this = this;
				_this.tableloading = true;
				_this.editVisible = false;
				let param = new URLSearchParams();
				param.append('username',_this.user.username);
				param.append('editable',_this.user.editable);
				param.append('description',_this.user.description);
				_this.$axios.post(this.Host+'/basic/update',param).then(resp => {
					if(resp && resp.status == 200){
						_this.tableloading = false;
						_this.clearuser();
						_this.loadusers();
					}
				})
			},
			addmeun(){
				var _this = this;
				_this.editTitle = "添加账户";
				_this.selectareas = [];
                _this.selectroles = '';
				_this.clearuser();
				_this.addVisible = true;
			},
			addsubmit(){
				var _this = this;
				_this.selectareas=this.$refs.treeadd.getCheckedNodes();
				if (_this.user.username == ''){
                    Message.error("请输入账户")
                    return
                }
				if (_this.selectroles == ''){
					Message.error("请选择角色")
					return
				}
				if (_this.selectareas.length == 0 ){
					Message.error("请选择至少一个区域")
					return
				}
				_this.tableloading = true;
				_this.addVisible = false;
				let param = new URLSearchParams();
				param.append('username',_this.user.username);
				param.append('rolename',_this.selectroles);
				param.append('description',_this.user.description);
				param.append('areaname',_this.selectareas);
				_this.$axios.post(this.Host+'/basic/regis',param).then(resp => {
					console.log(resp)
					if(resp && resp.status == 200){
						_this.tableloading = false;
						_this.clearuser();
						_this.loadusers();
					}
					this.selectroles=''
					this.selectareas=[]
				})
			},
			resetpwd(row){
				var _this = this;
				_this.tableloading = true;
				let param = new URLSearchParams();
				param.append('username',row.username);
				param.append('password',row.username);
				_this.$axios.post(this.Host+"/basic/update",param).then(resp => {
					if(resp && resp.status==200){
						_this.tableloading = false;
						_this.loadusers();
					}
				})
			},
			deleteuser(row){
				var _this = this;
				_this.tableloading = true;
				let param = new URLSearchParams;
				param.append('username', row.username);
				_this.$axios.post(this.Host+"/basic/deleteUser",param).then(resp => {
					if(resp && resp.status==200){
						_this.tableloading = false;
						_this.loadusers();
					}
				})
			},
			makesure(row){
				var _this = this;
				_this.$confirm('如果继续将删除账号'+row.username+'，删除后将无法恢复，请谨慎操作！','你确定要删除账号吗？',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					_this.deleteuser(row)
					_this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					_this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},
			getareas(){
				var _this = this;
				_this.$axios.get(this.Host+'/device/area').then(resp => {
					if(resp && resp.status==200){
						var data = resp.data;
						for (var each in data){
							if(!data.hasOwnProperty(each)){
								continue;
							}
							_this.areas.push(data[each].area_name)
						}
					}
				})
			},
			showpower(row){
				var _this = this;
				_this.editTitle="权限分配"
                this.selectroles = ''
                this.selectareas = []
                this.selectroles = row.roles[0].nameZh
				this.selectareas = [];
                for(let each in row.areaname){
                	this.selectareas.push(row.areaname[each])
                }
				_this.powerVisible = true;
				_this.user.username = row.username;
                for(let i=0;i<row.areaname.length;i++)
                {
                    this.treedefaultarea.push(row.areaname[i]);
                }
                console.log(this.treedefaultarea)
			},
			clearpower(){
				var _this = this;
				_this.powerVisible = false;
				_this.selectroles = [];
				this.$refs.tree.cleanCheckedNodes();
                this.treedefaultarea = [];
			},
			search(){
				this.currentpage = 1;
				this.loadusers();
			},
			submitpower(){
			    let nodes=this.$refs.tree.getCheckedNodes();
			    console.log(nodes)
				var _this = this;
				if (_this.selectareas.length == 0 ){
					Message.error("请选择至少一个区域")
					return
				}
				_this.powerVisible = false;
				let param = new URLSearchParams();
				param.append('rolename',_this.selectroles)
				param.append('username',_this.user.username)
				param.append('areaname',nodes)
				_this.$axios.post(this.Host+'/basic/AuthorityAllocation',param).then(resp => {
					console.log(resp)
					if(resp && resp.data.status==200){
						_this.loadusers();
						_this.clearpower();
					}
					_this.selectareas=[]
					_this.loadusers()
				})
			},
			formatroles(roles){
				let string = roles[0].nameZh;
				return string;
			},
			showAdvanceSearchView(){
				this.advanceSearchVisible = !this.advanceSearchVisible;
			},
			getdata(val){
				let index = val.index
				this.items[index] = val.data
			},
			formatareas(areaname){
				let string=''
				for (let each in areaname){
					string+=areaname[each]+'<br>'
				}
				return string
			},
            showAreaTree(val){
			    this.scopearea = val;
                this.AreaVisible = true;
            },
            dododo()
            {
                this.$refs.showTree.filter("123")
            }
		}
	}
</script>

<style>
    .el-switch__label {
        position: absolute;
        display: none;
        color: #fff;
    }
    /*打开时文字位置设置*/
    .el-switch__label--right {
        z-index: 1;
        right: -3px;
        color: #fff;
    }
    /*关闭时文字位置设置*/
    .el-switch__label--left {
        z-index: 1;
        left: 19px;
        color: #fff;
    }
    /*显示文字*/
    .el-switch__label.is-active {
        display: block;
        color: #fff !important;
    }
    .el-switch__core,
    .el-switch__label {
        width: 50px !important;
    }
    .el-dialog__body{
        padding: 0px 0px;
        color: #606266;
        font-size: 14px;
        word-break: break-all;
    }
    .el-dialog__header {
        padding: 20px 20px 10px;
        background: #20a0ff;
        color: #ffffff;
    }
    .el-main {
        display: block;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        -ms-flex-preferred-size: auto;
        flex-basis: auto;
        overflow: auto;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 10px;
    }
    .el-checkbox-button{
        width: 320px;
        height: 40px;
    }
    .el-checkbox-button__inner {
        text-align: left;
        display: inline-block;
        position: relative;
        left: 10px;
        width: 300px;
        height: 32px;
        padding: 8px 12px;
        border: 1px solid blanchedalmond;
    }
    .el-dialog__title{
        line-height: 24px;
        font-size: 18px;
        color: #ffffff;
    }

</style>
