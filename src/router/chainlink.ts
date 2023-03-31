const chainlinkRoute = [
  {
      path: "/dashboard",
      redirect: "/chainlink",
      component:() => import('@/views/chainLink/dashboard/index.vue'),
      children: [
        {
          path: "/chainlink/dashboard",
          name: "Dashboard",
          component:() => import('@/views/chainLink/dashboard/dashboard.vue'),
          meta:{
            isShow: true,
            sidebarMap: ['Dashboard'],
          }
        },
        {
          path: "/chainlink/default/:type",
          name: "Default",
          component:() => import('@/views/chainLink/components/rpcAndOracleDefault.vue'),
          meta:{
            isShow: false,
          },
        },
        {
          path: "/chainlink/oracle",
          name: "Oracle",
          redirect: "/chainlink/oracle",
          meta:{
            isShow: true,
          },
          children:[
              {
                  path: "/chainlink/oracle",
                  name: "Oracle",
                  component:() => import('@/views/chainLink/oracle/index.vue'),
                  meta:{
                    sidebarMap: ['Oracle'],
                  }
              },
              {
                  path: "/chainlink/oracle/subList",
                  name: "subList",
                  component:() => import('@/views/chainLink/oracle/mySubscription/subList.vue'),
                  meta:{
                    sidebarMap: ['Oracle'],
                  }
              },
              {
                  path: "/chainlink/oracle/subListDetail",
                  name: "subListDetail",
                  component:() => import('@/views/chainLink/oracle/mySubscription/subListDetail.vue'),
                  meta:{
                    sidebarMap: ['Oracle'],
                  }
              },
          ]
        },
        {
          path: "/chainlink/RPC",
          name: "RPC",
          redirect: "/chainlink/RPC",
          meta:{
            isShow: true,
          },
          children: [
            {
              path: "/chainlink/RPC",
              name: "RPC",
              component:() => import('@/views/chainLink/rpc/index.vue'),
              meta:{
                sidebarMap: ['RPC'],
              }
            },
            {
              path: "/chainlink/RPC/rpcDetail",
              name: "rpcDetail",
              component:() => import('@/views/chainLink/rpc/rpcDetail.vue'),
              meta:{
                sidebarMap: ['RPC'],
              }
            }
          ]
        },
        {
          path: "/chainlink/ZKP",
          name: 'ZKP',
          redirect: "/chainlink/ZKP",
          meta:{
            isShow: true,
            isTag: true,
            sidebarMap: ['ZKP'],
          },
          children:[
            {
              path: "/chainlink/ZKP",
              name: "ZKP",
              component:() => import('@/views/chainLink/miwaspace/index.vue'),
            },
          ]
        },
        {
          path: "/chainlink/graph",
          name: 'Graph',
          redirect: "/chainlink/graph",
          meta:{
            isShow: true,
            isTag: true,
            sidebarMap: ['Graph'],
          },
          children:[
            {
              path: "/chainlink/graph",
              name: "Graph",
              component:() => import('@/views/chainLink/miwaspace/index.vue'),
            },
          ]
        },
        {
          path: "/chainlink/storage",
          name: 'Storage',
          redirect: "/chainlink/storage",
          meta:{
            isShow: true,
            isTag: true,
            sidebarMap: ['Storage'],
          },
          children:[
            {
              path: "/chainlink/storage",
              name: "Storage",
              component:() => import('@/views/chainLink/miwaspace/index.vue'),
            },
          ]
        },
        {
          path: "/chainlink/others",
          name: "Others",
          redirect: "/chainlink/others",
          meta:{
            isShow: true,
            isTag: true,
            sidebarMap: ['Others'],
          },
          children:[
            {
              path: "/chainlink/others",
              name: "Others",
              component:() => import('@/views/chainLink/miwaspace/index.vue'),
            },
          ]
        },
      ],
  },
  {
    path: "/miwaspace",
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

// const chainlinkRoute = [
//     {
//         path: "/dashboard",
//         redirect: "/chainlink/dashboard",
//         children: [
//           {
//             path: "/chainlink/dashboard",
//             name: "Dashboard",
//             component:() => import('@/views/chainLink/dashboard/index.vue'),
//             meta:{
//               isShow: true,
//             }
//           },
//           {
//             path: "/chainlink/default/:type",
//             name: "Default",
//             component:() => import('@/views/chainLink/components/rpcAndOracleDefault.vue'),
//             meta:{
//               isShow: false,
//             },
//           },
//           {
//             path: "/chainlink/oracle",
//             name: "Oracle",
//             redirect: "/chainlink/oracle",
//             meta:{
//               isShow: true,
//             },
//             children:[
//                 {
//                     path: "/chainlink/oracle",
//                     name: "Oracle",
//                     component:() => import('@/views/chainLink/oracle/index.vue'),
//                 },
//                 {
//                     path: "/chainlink/oracle/subList",
//                     name: "subList",
//                     component:() => import('@/views/chainLink/oracle/mySubscription/subList.vue'),
//                 },
//                 {
//                     path: "/chainlink/oracle/subListDetail",
//                     name: "subListDetail",
//                     component:() => import('@/views/chainLink/oracle/mySubscription/subListDetail.vue'),
//                 },
//             ]
//           },
//           {
//             path: "/chainlink/RPC",
//             name: "RPC",
//             redirect: "/chainlink/RPC",
//             meta:{
//               isShow: true,
//             },
//             children: [
//               {
//                 path: "/chainlink/RPC",
//                 name: "RPC",
//                 component:() => import('@/views/chainLink/rpc/index.vue'),
//               },
//               {
//                 path: "/chainlink/RPC/rpcDetail",
//                 name: "rpcDetail",
//                 component:() => import('@/views/chainLink/rpc/rpcDetail.vue'),
//               }
//             ]
//           }
//         ],
//     },
//     {
//       path: "/miwaspace",
//       redirect: "/chainlink/miwaspace",
//       children:[
//         {
//           path: "/chainlink/miwaspace",
//           name: "Miwaspace",
//           component:() => import('@/views/chainLink/miwaspace/index.vue'),
//         },
//       ]
//     }
// ]
export default chainlinkRoute