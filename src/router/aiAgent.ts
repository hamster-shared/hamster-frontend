const aiAgentRoute = [
  {
    path: "/aiAgent/work",
    redirect: "/aiAgent/work",
    component: () => import('@/views/aiAgent/home/index.vue'),
    children: [
      {
        path: "/aiAgent/work",
        name: "Work",
        component: () => import('@/views/aiAgent/work/index.vue'),
        meta: {
          isShow: true,
          sidebarMap: ['Work'],
        }
      },
      {
        path: "/aiAgent/marketplace",
        name: "Marketplace",
        key: 'Marketplace',
        redirect: "/aiAgent/marketplace",
        meta: {
          isShow: false,
        },
        children: [
          {
            path: "/aiAgent/marketplace",
            name: "Marketplace",
            component: () => import('@/views/aiAgent/marketplace/index.vue'),
            meta: {
              sidebarMap: ['Marketplace'],
            }
          },
          {
            path: "/aiAgent/marketplace/detail",
            name: "MarketplaceDetail",
            component: () => import('@/views/aiAgent/marketplace/detail.vue'),
            meta: {
              sidebarMap: ['Marketplace'],
            }
          }
        ]
      },
      {
        path: "/aiAgent/agent",
        name: "Agent",
        redirect: "/aiAgent/agent",
        meta: {
          isShow: false,
        },
        children: [
          {
            path: "/aiAgent/agent",
            name: "Agent",
            component: () => import('@/views/aiAgent/agent/index.vue'),
            meta: {
              sidebarMap: ['Agent'],
            }
          }
        ]
      }
    ],
  }
]
export default aiAgentRoute
