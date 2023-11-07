const orderRoute = [
  {
    path: "/orders",
    children: [
      {
        path: "/orders",
        name: "OrdersList",
        component: () => import('@/views/orders/index.vue'),
      }
    ],
  }
]
export default orderRoute