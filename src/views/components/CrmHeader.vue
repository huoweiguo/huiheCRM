<template>
  <div class="crm-header">
    <div class="crm-header-logo">
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      <h2>慧合CRM管理系统</h2>
    </div>
    <div class="crm-header-logo">
      <el-avatar class="mr10" :src="circleUrl" />
      <div class="header-list">
        <span class="header-user">
          {{ (userInfo.user as UserInfo).nickName }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <ul>
          <li>系统消息</li>
          <li>个人中心</li>
          <li>修改密码</li>
          <li @click="logout">退出登录</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import * as _ from 'lodash'
import { useLoginStore } from '@/store/login'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const userLogin = useLoginStore()
const router = useRouter()
interface UserInfo {
  [index: string]: unknown
}
const userInfo = reactive<UserInfo>(userLogin.userInfo)
const circleUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const logout = () => {
  userLogin.logOut().then(res => {
    if (res.data.code === 200) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      userLogin.token = ''
      userLogin.userInfo = {}
      setTimeout(() => {
        router.push('/login')
      })
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}
</script>

<style lang="scss" scoped>
.crm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  background-color: rgba(99, 99, 99, 1);
  padding: 0 30px;
  border-bottom: 1px solid #ccc;
  .crm-header-logo {
    display: flex;
    align-items: center;
    .header-list {
      position: relative;
      height: 40px;
      line-height: 40px;
      .header-user {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 16px;
      }
      ul {
        position: absolute;
        left: 0;
        top: 40px;
        z-index: 10;
        background-color: #fff;
        width: 130px;
        text-align: center;
        border: 1px solid #efefef;
        display: none;
        li {
          height: 35px;
          line-height: 35px;
          font-size: 14px;
          cursor: pointer;
          color: #777;
          border-bottom: 1px solid #efefef;
          &:hover {
            color: #1890ff;
          }
        }
      }
      &:hover {
        ul {
          display: block;
        }
      }
    }
    h2 {
      margin-left: 10px;
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>
