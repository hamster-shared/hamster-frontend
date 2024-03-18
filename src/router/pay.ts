const payRoute = [
{
    path: "/middleware/pay",
    children: [
        {
            path: "/middleware/pay",
            name: "pay",
            component: () => import('@/views/pay/index.vue'),
        },
        {
            path: "/middleware/payR",
            name: "payR",
            component: () => import('@/views/pay/payR.vue'),
        },
    ],
}
]
export default payRoute