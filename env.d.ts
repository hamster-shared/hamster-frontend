
// typescript 只能理解 .ts 文件,无法理解 .vue文件 
// 解决方法:在项目根目录或 src 文件夹下创建一个后缀为 .d.ts 的文件,并写入以下内容: declare module '*.vue' 
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
  }

