<template>
  <div>
      <head-top></head-top>
    <el-container style="margin-top: 20px">
      <el-header style="height: 60px; width:100%;">
        <div style="display: inline">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-button round type="primary"  icon="el-icon-plus" style="float:left" @click="addmeun"> 添加设备</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input  placeholder="搜索" clearable prefix-icon="el-icon-search"
                               style="width: 300px; float:right" v-model="keywords"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" icon="el-icon-search" style="float: right;" @click="search">搜索</el-button>
                </el-col>
                <el-col :span="4" :offset="4">
                    <el-button type="primary" style="background: #e64242;" @click="makemultipleDelete">批量删除</el-button>
                </el-col>
            </el-row>
        </div>
      </el-header>
      <el-main style="height: 600px">
        <el-table :data="devices" v-loading="tableloading" border stripe
                  size="mini" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" ></el-table-column>
          <el-table-column type="text" prop="id" align="center"
                           fixed label="设备名称" width="" ></el-table-column>
          <el-table-column type="text" prop="areaname" align="center"
                           fixed label="所属区域" width="" ></el-table-column>
          <el-table-column type="text" prop="latitude" align="center"
                           fixed label="维度" width=""></el-table-column>
          <el-table-column type="text" prop="longitude" align="center"
                           fixed label="经度" width=""></el-table-column>
          <el-table-column type="text" prop="description" align="center"
                           fixed label="说明" width=""></el-table-column>
          <el-table-column type="text" prop="type" align="center"
                           fixed label="类型" width=""></el-table-column>
          <el-table-column type="text"  align="center"
                           fixed="right" label="操作" width="400px">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="edit(scope.row)">信息修改</el-button>
                <el-button type="primary" size="small" @click="makesureDelete(scope.row)">删除设备</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <label>{{"显示第 " + (1+(currentpage-1)*10)+ " 到第 " + ((currentpage)*10>num?num:(currentpage)*10) + " 条记录，总共 " + num + " 条记录"}}</label>
        <el-pagination
          style="float: right"
          background
          layout="prev, pager, next"
          :total="num" :page-size="10" :current-page.sync="currentpage" @current-change="loaddevices">
        </el-pagination>
      </el-footer>
    </el-container>


  <div style="text-align: left">
    <el-dialog :title="editTitle"
               style="padding: 0px;height: 100%"
               :close-on-click-modal="false"
               :visible.sync="addVisible"
               width="77%"
               :append-to-body='true'>
        <el-container>
            <el-aside width="50%">
                <el-form :model="device" status-icon style="margin: 0px;padding: 0px;">
                    <el-row>
                        <el-col>
                            <div>
                                <el-form-item label="设备名称:" label-width="120px" label-position="right" prop="id" >
                                    <el-input v-model="device.id"
                                              size="mini" style="width: 150px" ></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div>
                                <el-form-item label="维度:" label-width="120px" label-position="right" prop="latitude" >
                                    <el-input v-model="device.latitude"
                                              size="mini" style="width: 150px" ></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div>
                                <el-form-item label="经度:" label-width="120px" label-position="right" prop="longitude" >
                                    <el-input v-model="device.longitude"
                                              size="mini" style="width: 150px" ></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div>
                                <el-form-item label="说明:" label-width="120px" label-position="right" prop="description" >
                                    <el-input v-model="device.description"
                                              size="mini" style="width: 150px" ></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div>
                                <el-form-item label="有无PM2.5:" label-width="120px" label-position="right" prop="type" >
                                    <el-radio-group v-model="device.type">
                                        <el-radio v-for="type in types"
                                                  :key="type" :label="type" border>{{ type }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </el-aside>
            <el-main>
                <el-header style="padding: 20px 20px 10px;background: #eeeeee;">
                    所属区域
                </el-header>
                <area-tree ref="addTree" :init="[]" :change="false" :defa="[]"></area-tree>
            </el-main>
        </el-container>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelchange">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitadd">确 定</el-button>
        </span>
    </el-dialog>
  </div>

      <div style="text-align: left">
          <el-dialog :title="editTitle"
                     style="padding: 0px;"
                     :close-on-click-modal="false"
                     :visible.sync="editVisible"
                     width="77%"
                     :append-to-body='true'>
              <el-container>
                  <el-aside width="50%">
                      <el-form :model="device" style="margin: 0px;padding: 0px;">
                          <el-row>
                              <el-col>
                                  <div>
                                      <el-form-item label="设备名称:" label-width="120px" label-position="right" prop="id" >
                                          <el-input v-model="device.id"
                                                    size="mini" style="width: 150px" ></el-input>
                                      </el-form-item>
                                  </div>
                              </el-col>
                          </el-row>
                          <el-row>
                              <el-col>
                                  <div>
                                      <el-form-item label="维度:" label-width="120px" label-position="right" prop="latitude" >
                                          <el-input v-model="device.latitude"
                                                    size="mini" style="width: 150px" ></el-input>
                                      </el-form-item>
                                  </div>
                              </el-col>
                          </el-row>
                          <el-row>
                              <el-col>
                                  <div>
                                      <el-form-item label="经度:" label-width="120px" label-position="right" prop="longitude" >
                                          <el-input v-model="device.longitude"
                                                    size="mini" style="width: 150px" ></el-input>
                                      </el-form-item>
                                  </div>
                              </el-col>
                          </el-row>
                          <el-row>
                              <el-col>
                                  <div>
                                      <el-form-item label="说明:" label-width="120px" label-position="right" prop="description" >
                                          <el-input v-model="device.description"
                                                    size="mini" style="width: 150px" ></el-input>
                                      </el-form-item>
                                  </div>
                              </el-col>
                          </el-row>
                          <el-row>
                              <el-col>
                                  <div>
                                      <el-form-item label="有无PM2.5:" label-width="120px" label-position="right" prop="type" >
                                          <el-radio-group v-model="device.type">
                                              <el-radio v-for="type in types"
                                                        :key="type" :label="type" border>{{ type }}</el-radio>
                                          </el-radio-group>
                                      </el-form-item>
                                  </div>
                              </el-col>
                          </el-row>
                      </el-form>
                  </el-aside>
                  <el-main>
                      <el-header style="padding: 20px 20px 10px;background: #eeeeee;">
                          所属区域
                      </el-header>
                      <area-tree ref="editTree" :init="[]" :change="false" :defa="treedefaultarea"></area-tree>
                  </el-main>
              </el-container>
              <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="cancelchange">取 消</el-button>
              <el-button size="mini" type="primary" @click="submitchange">确 定</el-button>
            </span>
          </el-dialog>
      </div>
  </div>
</template>

<script>
	import headTop from '../components/headTop';
	import {testUrl} from '../config/env'
	import axios from 'axios';
    import {Message} from 'element-ui';
    import AreaTree from '../components/area.vue';
  export default {
  	components:{headTop,AreaTree},
    data(){
      var validatePass= (rule,value,callback) => {
        if(isNaN(value)){
          callback(new Error('请输入数字'));
        }
      }
      return{
        keywords: '',
        devices: [],
        types: [],
        areas: [],
        device: {
          id: null,
          description: '',
          latitude: null,
          longitude: null,
          type: '',
            areaname:'',
        },
        num: null,
        tableloading: false,
        currentpage: 1,
        editTitle: '',
        editVisible: false,
        addVisible: false,
        treedefaultarea: [],
        multipleSelection: [],

      }
    },
    mounted() {
      this.loaddevices();
    },
    methods: {
      loaddevices(){
        var _this = this;
        _this.tableloading = true;
        console.log(testUrl+"/basic/devices?page="+this.currentpage+"&size=10&keywords= "+this.keywords);
        axios.get(testUrl+"/basic/devices?page="+this.currentpage+"&size=10&keywords="+this.keywords).then(resp => {
          if(resp && resp.status==200){
            console.log(resp)
            _this.areas = resp.data.areas;
            _this.types = resp.data.types;
            _this.tableloading = false;
            _this.devices = resp.data.devices;
            _this.num = resp.data.count;
          }
        })
      },
      search(){
        this.currentpage = 1;
        this.loaddevices();
      },
      edit(row){
        this.editTitle = "设备信息";
        this.device.id = row.id;
        this.device.latitude = row.latitude;
        this.device.longitude = row.longitude;
        this.device.description = row.description;
        this.device.type = row.type;
        this.editVisible = true;
		  this.treedefaultarea = [];
        let temp = row.areaname.split("-");
        this.treedefaultarea.push(temp[temp.length-1]);
      },
      submitchange(){
        var _this = this;
        _this.editVisible = false;
        _this.tableloading = true;
        this.device.areaname = this.$refs.editTree.getCheckedNodes()
          if(this.device.areaname.length>1){
          	Message.error("请只选择一个区域")
              this.tableloading = false
              return
          }
        let param = new URLSearchParams();
        param.append('id',_this.device.id)
        param.append('latitude',_this.device.latitude)
        param.append('longitude',_this.device.longitude)
        param.append('description',_this.device.description)
        param.append('type',_this.device.type)
          param.append('areaname', this.device.areaname[0])
        axios.post(testUrl+'/basic/updatedevice',param).then(resp => {
          console.log(resp)
            if(resp && resp.data.status == 200){
                Message.success(resp.data.msg)
            }else if(resp && resp.data.status == 400){
                Message.error(resp.data.msg);
            }
            _this.tableloading = false;
            _this.loaddevices();
        })
      },
      cancelchange(){
        this.editVisible = false;
        this.addVisible = false;
        this.treedefaultarea = [];
      },
      addmeun(){
        this.addVisible = true;
        this.editTitle='添加设备'
        this.device = {
          id: null,
          description: '',
          latitude: null,
          longitude: null,
          type: '',
          areaname: ''
        }
      },
      submitadd(){
        var _this = this;
        this.device.areaname = this.$refs.addTree.getCheckedNodes();
        let d = this.device;
        if(d.id==null || d.description=='' || d.latitude==null || d.longitude==null || d.type=='' || d.areaname.length>1){
            if(d.areaname.length>1){
				Message.error('请只选择一个区域');
				return;
            }
        	Message.error('请输入完整设备信息');
            return
        }
        console.log(this.device.areaname)
        let param = new URLSearchParams();
        param.append('id',_this.device.id)
        param.append('latitude',_this.device.latitude)
        param.append('longitude',_this.device.longitude)
        param.append('description',_this.device.description)
        param.append('statusname','正常')
        param.append('type',_this.device.type)
        param.append('areaname',_this.device.areaname[0])
          param.append('sensor_value',255)
        axios.post(testUrl+'/basic/addDevice',param).then(resp => {
			console.log(resp);
        	if(resp && resp.data.status == 200){
        		Message.error(resp.data.msg)
            }else if(resp && resp.data.status == 400){
        		Message.error(resp.data.msg)
            }else if(resp && resp.data.status == 402){
				Message.error(resp.data.msg)
            }

          _this.addVisible = false;
          _this.loaddevices();
        })
      },
      makesureDelete(row){
            var _this = this;
            _this.$confirm('如果继续将删除设备'+row.id+'，删除后将无法恢复，请谨慎操作！','你确定要删除设备吗？',
                {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                _this.deletedevice(row)
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            })
        },
      deletedevice(row){
            var _this = this;
            _this.tableloading = true;
             let param = {}
             param['device_id']=row.id;
             console.log(param)
            _this.$axios.post(testUrl+"/basic/deleteDevice",param).then(resp => {
                console.log(resp);
                _this.addVisible = false;
                _this.loaddevices();
            })
        },
      handleSelectionChange(val){
          console.log(val)
          this.multipleSelection=[];
          for(let i=0;i<val.length;i++){
              this.multipleSelection.push(val[i].id)
          }
          console.log(this.multipleSelection)
      },
        makemultipleDelete(){
            var _this = this;
            _this.$confirm('如果继续将删除选中设备'+'，删除后将无法恢复，请谨慎操作！','你确定要删除设备吗？',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                _this.multipleDelete();
            }).catch(()=>{
                _this.$message({
                    type: 'info',
                    message: '已取消批量删除'
                })
            })
        },
        multipleDelete(){
          let param = new URLSearchParams();
          param.append("device_id",this.multipleSelection)
          this.$axios.post(testUrl+"/basic/batchDelete",param).then(resp=>{
              console.log(resp);
              if(resp && resp.data.status == 200){
                  this.$message({
                      type: 'success',
                      message: '删除成功!'
                  })
              }else if(resp && resp.data.status == 400){
                    this.$message({
                        type: 'info',
                        message: '删除失败'
                    })
              }
              this.loaddevices()
          })
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
</style>

