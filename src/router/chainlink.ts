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
                    path: "/chainlink/oracle/subList/subListDetail",
                    name: "subListDetail",
                    component:() => import('@/views/chainLink/oracle/mySubscription/subListDetail.vue'),
                },
            ]
          },
          {
            path: "/chainlink/RPC",
            name: "RPC",
            redirect: "/chainlink/RPC",
            children: [
              {
                path: "/chainlink/RPC",
                name: "RPC",
                component:() => import('@/views/chainLink/rpc/index.vue'),
              },
              {
                path: "/chainlink/RPC/rpcDetail",
                name: "rpcDetail",
                component:() => import('@/views/chainLink/rpc/rpcDetail.vue'),
              }
            ]
          }
        ],
    },
    {
      path: "/dashboard",
      redirect: "/chainlink/miwaspace",
      children:[
        {
          path: "/chainlink/miwaspace",
          name: "Miwaspace",
          component:() => import('@/views/chainLink/miwaspace/index.vue'),
        },
      ]
    }
]
export default chainlinkRoute