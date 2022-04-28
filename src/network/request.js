import axios from 'axios'

export function request(config){
    return new Promise((resolve, reject)=>{
      const instance = axios.create({
        // local
        baseURL: "http://127.0.0.1:8000",
        // prod
        // baseURL: 'http://192.168.1.194:8000',
        timeout: 50000,
        withCredentials: true,
        headers:{
          'Authorization': localStorage.getItem('token')? localStorage.getItem('token'):'',
          'Content-Type':'application/x-www-form-urlencoded'
        }
      })

      instance(config).then(res =>{
        resolve(res.data)
      }).catch(err =>{
        reject(err)
      })
      instance.interceptors.response.use(response => {
        return response
      }, error =>{
        if(error.response){
          if(error.response.data.status == 401){
            this.$router.push('/login')
          }
        }
        return Promise.reject(error)
      })

      // instance.interceptors.request.use(config =>{
      //   if(localStorage.getItem('token')){
      //     console.log('interceptor',config);
      //     config.headers.Authorization = localStorage.getItem('token')
      //   }else {
      //
      //   }
      //   return config
      // },error => {
      //   return Promise.reject(error)
      // })
    })


  // 请求拦截器  注意，，，拦截之后需要返回config
  // instance.interceptors.request.use(config =>{
  //   //应用： config中的信息不符合服务器的要求
  //   // 发送网络请求时，显示请求图标
  //   // 登录必须携带的内容，如token，判断token，没有token跳转走
  //   return config
  // }, error =>{} );
  //   //响应拦截
  // instance.interceptors.response.use(res =>{
  //   return res.data
  // },error => {
  //
  // });


}
