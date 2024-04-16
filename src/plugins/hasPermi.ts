import { App, DirectiveBinding, Plugin } from 'vue'
import { useLoginStore } from '@/store/login'

interface BtnAuthOptions {
  // 可选的配置项
}

const BtnAuth: Plugin = {
  install(app: App, options?: BtnAuthOptions) {
    // 注册全局指令
    app.directive('hasPermi', {
      mounted(el: HTMLElement, binding: DirectiveBinding<any>) {
        const userLogin = useLoginStore()
        const { value } = binding
        const all_permission = '*:*:*'
        const permissions: any = userLogin.userInfo.permissions

        if (value && value instanceof Array && value.length > 0) {
          const permissionFlag = value

          const hasPermissions = permissions.some((permission: string) => {
            return all_permission === permission || permissionFlag.includes(permission)
          })

          if (!hasPermissions) {
            el.parentNode && el.parentNode.removeChild(el)
          }
        } else {
          throw new Error(`请设置操作权限标签值`)
        }
      }
      // 其他生命周期钩子
    })
  }
}

export default BtnAuth
