<template>
	<div class="manage_page fillcontain"v-on:mousemove="showXY">
<!--        <headTop></headTop>-->
<!--        当前鼠标位置（相对该div左上角）：<br> x:{{x}},y:{{y}},xx:{{xx}},arrival:{{arrival}}-->
		<el-row >
            <div class="menu1">
	  		<el-col   style="min-height: 100% ;background-color: #dc5293;">

				<el-menu class="el-menu-vertical-demo":default-active="defaultActive"   router :collapse="isCollapse" @mouseenter.native="collapseOpen"
                         @mouseleave.native="collapseClose">
<!--                         background-color="#283043"-->
<!--                         text-color="#fff"-->
<!--                         active-text-color="#1588c7">-->
<!--                    <el-menu-item index="/"><i class="el-icon-menu"></i><span slot="title">>首页</span></el-menu-item>-->
<!--					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>-->
<!--					<el-submenu index="2">-->
<!--						<template slot="title"><i class="el-icon-document"></i><span slot="title">>数据管理</span></template>-->
<!--						<el-menu-item index="userList"><span slot="title">>用户列表</span></el-menu-item>-->
<!--						<el-menu-item index="shopList"><span slot="title">>商家列表</span></el-menu-item>-->
<!--						<el-menu-item index="foodList"><span slot="title">>食品列表</span></el-menu-item>-->
<!--						<el-menu-item index="orderList"><span slot="title">>订单列表</span></el-menu-item>-->
<!--						<el-menu-item index="adminList"><span slot="title">>管理员列表</span></el-menu-item>-->
<!--					</el-submenu>-->
<!--					<el-submenu index="3">-->
<!--						<template slot="title"><i class="el-icon-plus"></i><span slot="title">>添加数据</span></template>-->
<!--						<el-menu-item index="addShop">><span slot="title">添加商铺</span></el-menu-item>-->
<!--						<el-menu-item index="addGoods">><span slot="title">添加商品</span></el-menu-item>-->
<!--					</el-submenu>-->
<!--					<el-submenu index="4">-->
<!--						<template slot="title"><i class="el-icon-star-on"></i><span slot="title">>图表</span></template>-->
<!--						<el-menu-item index="visitor">><span slot="title">用户分布</span></el-menu-item>-->
<!--						&lt;!&ndash; <el-menu-item index="newMember">用户数据</el-menu-item> &ndash;&gt;-->
<!--					</el-submenu>-->
<!--					<el-submenu index="5">-->
<!--						<template slot="title"><i class="el-icon-edit"></i><span slot="title">>编辑</span></template>-->
<!--						&lt;!&ndash; <el-menu-item index="uploadImg">上传图片</el-menu-item> &ndash;&gt;-->
<!--						<el-menu-item index="vueEdit">><span slot="title">文本编辑</span></el-menu-item>-->
<!--					</el-submenu>-->
<!--					<el-submenu index="6">-->
<!--						<template slot="title"><i class="el-icon-setting"></i><span slot="title">>设置</span></template>-->
<!--						<el-menu-item index="adminSet">><span slot="title">管理员设置</span></el-menu-item>-->
<!--						&lt;!&ndash; <el-menu-item index="sendMessage">发送通知</el-menu-item> &ndash;&gt;-->
<!--					</el-submenu>-->
<!--					<el-submenu index="7">-->
<!--						<template slot="title"><i class="el-icon-warning"></i><span slot="title">>说明</span></template>-->
<!--						<el-menu-item index="explain">><span slot="title">说明</span></el-menu-item>-->
<!--					</el-submenu>-->
<!--                    <el-submenu index="8">-->
<!--                        <template slot="title"><i class="el-icon-warning"></i><span slot="title">>设备状态</span></template>-->
<!--                        <el-menu-item index="test">><span slot="title">所有设备状态</span></el-menu-item>-->
<!--                        <el-menu-item index="singleStatus">><span slot="title">单设备状态</span></el-menu-item>-->
<!--                    </el-submenu>-->
<!--                    <el-submenu index="9">-->
<!--                        <template slot="title"><i class="el-icon-warning"></i><span slot="title">>222</span></template>-->
<!--                        <el-menu-item index="EmpBasic"><span slot="title">333</span></el-menu-item>-->
<!--                    </el-submenu>-->
                    <el-menu-item index="HomeMap"><i class="el-icon-menu"></i><span slot="title">>首页</span></el-menu-item>

                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-folder-opened"></i><span slot="title">>数据中心</span></template>
                        <el-menu-item index="tempearatureHumidity"><span slot="title">> 环境数据</span></el-menu-item>
                        <el-menu-item index="pm25Luminance"><span slot="title">> 气象数据</span></el-menu-item>
                        <el-menu-item index="reclose"><span slot="title">> 电源数据</span></el-menu-item>

                    </el-submenu>

                    <el-submenu index="3" v-if="controllerShow">
                        <template slot="title"><i class="el-icon-setting"></i><span slot="title">>设备管理</span></template>
                        <el-menu-item index="devices" v-if="adminShow"><span slot="title" >> 设备管理</span></el-menu-item>
                        <el-menu-item index="deviceControl" ><span slot="title" >> 设备批量控制</span></el-menu-item>

                    </el-submenu>
                    <el-submenu index="4" v-if="adminShow">
                        <template slot="title"><i class="el-icon-user-solid"></i><span slot="title">>系统管理</span></template>
                        <el-menu-item index="user"><span slot="title">> 用户管理</span></el-menu-item>
                        <el-menu-item index="areaControl"><span slot="title">> 区域管理</span></el-menu-item>
                    </el-submenu>

                </el-menu>

			</el-col>
    </div>
            <div class="content">
			<el-col  style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
            </div>
		</el-row>

  	</div>
</template>

<script>
	import headTop from '../components/headTop';
    export default {data(){
			return {
				show3: false,
				x:null,
                xx:null,
                y:null,
                arrival:0,
				isCollapse:true,
                is:true
			}
		},
		methods:{
			showXY:function(event){
				this.x = event.clientX;
				this.y = event.clientY;
			},
			collapseClose() {
				// if (this.collapseBtnClick) return;
				this.isCollapse = true;
			},
			collapseOpen() {
				// if (this.collapseBtnClick) return;
				this.isCollapse = false;
			}
		},
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			},
			adminShow : function(){
				return this.$store.state.user.role === 'ROLE_admin';
            },
            controllerShow : function () {
		        return this.$store.state.user.role === 'ROLE_controller'||this.$store.state.user.role === 'ROLE_admin';
			}
		},
		components: {
			headTop,
		},
	}
</script>


<style lang="less" scoped>
	@import '../style/mixin';
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;

    }

    .content{
        position:absolute;left:64px;top:0px;z-index:80;
        width:97%;

    }
    .menu1{
        position:absolute;left:0px;top:0px;z-index:90;
    }



</style>
