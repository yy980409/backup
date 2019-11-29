<template>
    <div>
<!--        <el-input v-show="change" placeholder="请输入地区名称" clearable prefix-icon="el-icon-search"-->
<!--                  style="width: 300px;" v-model="input" ></el-input>-->
<!--        <el-button type="primary" @click="search">搜索</el-button>-->
        <div style="width:100%">
            <el-tree :data="AreaTree" :props="props" ref="tree"
                     :show-checkbox="showcheckbox" node-key="area_name"
                     highlight-current :expand-on-click-node="false"
                     default-expand-all :filter-node-method="filterNode"
                     >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                        <div v-if="node.isLeaf">
                            <span>
                    <el-button v-show="change"
                               type="primary" round
                               size="mini"
                               @click="addview(node.label)">
                        添加区域
                    </el-button>
                    <el-button v-show="change"
                               type="primary" round
                               style="background: #e64242;"
                               size="mini"
                               @click="makesure(node.label)">
                        删除区域
                    </el-button>
                    </span>
                        </div>

                    </span>
            </el-tree>

        </div>

        <el-dialog :title="'添加区域'"
                   style="padding: 0px;height: 100%"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :visible.sync="addvisible"
                   width="30%" @close="addclose">
            <el-form :model="apartment" style="margin: 0px;padding: 0px;height: 100%;">
                <el-row>
                    <el-col>
                        <div>
                            <el-form-item label="上级区域:" label-width="120px" label-position="right" prop="username" >
                                <el-select v-model="apartment.parent">
                                    <el-option v-for="(area,index) in areas"
                                               :key="index"
                                               :label="area"
                                               :value="area"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col>
                        <div>
                            <el-form-item label="地区名称:" label-width="120px" label-position="right" prop="description">
                                <el-input prefix-icon="el-icon-edit" placeholder="请输入内容"
                                          size="mini" style="width: 80%" v-model="apartment.name"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitadd">
                    确定
                </el-button>
                <el-button @click="addclose">
                    取消
                </el-button>
            </span>
        </el-dialog>

    </div>

</template>

<script>
    import {testUrl} from '../config/env'
	export default {
        data(){
            return{
                props:{
                    label: 'area_name',
                    childrean: 'childrean',
                },
                showcheckbox: true,
                AreaTree: [],
                addvisible: false,
                areas: [],
                apartment: {
                    parent: '',
                    name: '',
                },
                issuccess: false,
                input: '',
            }
        },
        mounted:function () {
            this.loadareas();
        },
        props:['init', 'change','defa'],
        watch:{
            init:{
                handler(val){
                    this.init = val;
                    if(val.length>0)
                    {
                        this.$refs.tree.filter(val);
                    }
                },
            },
            defa:{
                handler(val){
                    this.defa = val;
                    this.$refs.tree.setCheckedKeys(this.defa)
                },

            }
        },
        methods:{
            async loadareas(){
                let _this = this;
                await this.post();
                if(this.init.length>0){
                    this.$refs.tree.filter(this.init);
                    this.showcheckbox=false;
                    this.$axios.get(testUrl+'/device/area/getAllArea').then(resp =>{
                        console.log(resp);
                        this.areas = resp.data;

                    })
                }
                this.$refs.tree.setCheckedKeys(this.defa)
            },
            async post(){
                let param = new URLSearchParams();
                param.append("pid",-1);
                var ii = await this.$axios.post(testUrl+'/basic/getAreaTree',param);
                this.AreaTree = ii.data;
            },
            getCheckedNodes() {
                let nodes=this.$refs.tree.getCheckedNodes();
                let ret = [];
                for(let i=0,len=nodes.length;i<len;i++)
                {
                    if(nodes[i].isparent == false)
                    {
                        ret.push(nodes[i].area_name);
                    }
                }
                return ret;
            },
            cleanCheckedNodes(){
                this.$refs.tree.setCheckedNodes([]);
            },
            filterNode(value,data) {
                if(!value) return true;
                return value.indexOf(data.area_name) !== -1;
            },
            addview(val){
              this.addvisible = true;
              this.apartment.parent = val;
            },
            addclose(){
                this.addvisible = false;
                this.apartment.name = '';
            },
            submitadd() {
                let param = new URLSearchParams();
                param.append('areaname',this.apartment.name);
                param.append('parentname',this.apartment.parent);
                this.$axios.post(testUrl+'/basic/addArea',param).then(resp =>{
                    console.log(resp);
                    this.addvisible = false;
                    this.loadareas();

                })
            },
            async deleteArea(val){
                let param = new URLSearchParams();
                param.append('areaname',val)
                await this.$axios.post(testUrl+'/basic/deleteArea',param).then(resp=>{
                    if(resp && resp.data.status == 200){
                        this.loadareas();
                        this.issuccess = true
                        return;
                    }else if(resp && resp.data.status == 400){
                        this.issuccess = false;
                        return;
                    }
                })
            },
            async makesure(val){
                var _this = this;
                _this.$confirm('如果继续将删除区域'+val+'，删除后将无法恢复，请谨慎操作！','你确定要删除区域吗？',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(async () => {
                    await _this.deleteArea(val);
                    if(_this.issuccess){
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else {
                        _this.$message({
                            type: 'info',
                            message: '该区域下有设备，无法删除'
                        });
                    }
                }).catch(() => {
                    _this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            },
        }
	}
</script>

<style >
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .el-dialog__title{
        line-height: 24px;
        font-size: 18px;
        color: #ffffff;
    }
    .el-dialog__header {
        padding: 20px 20px 10px;
        background: #20a0ff;
        color: #ffffff;
    }
</style>
