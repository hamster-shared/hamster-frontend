const chainlinkRoute = [
    {
        path: "/dashboard",
        redirect: "/chainlink/dashboard",
        children: [
          {
            path: "/chainlink/dashboard",
            name: "Dashboard",
            component:() => import('@/views/chainLink/dashboard/index.vue'),
          },
          {
            path: "/chainlink/default/:type",
            name: "Default",
            component:() => import('@/views/chainLink/components/rpcAndOracleDefault.vue'),
          },
          {
            path: "/chainlink/oracle",
            name: "Oracle",
            redirect: "/chainlink/oracle",
            children:[
                {
                    path: "/chainlink/oracle",
                    name: "Oracle",
                    component:() => import('@/views/chainLink/oracle/index.vue'),
                },
                {
                    path: "/chainlink/oracle/subList",
                    name: "subList",
                    component:() => import('@/views/chainLink/oracle/mySubscription/subList.vue'),
                },
                {
                    path: "/chainlink/oracle/subListDetail",
                    name: "subListDetail",
                    component:() => import('@/views/chainLink/oracle/mySubscription/subListDetail.vue'),
                },
                {
                    path: "/chainlink/oracle/createRequest",
                    name: "CreateRequest",
                    component:() => import('@/views/chainLink/oracle/createRequest/index.vue'),
                },
            ]
          },
          {
            path: "/chainlink/rpc",
            name: "Rpc",
            component:() => import('@/views/chainLink/rpc/index.vue'),
          }
        ],
    },

]
export default chainlinkRoute