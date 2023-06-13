const payRoute = [
{
    path: "/pay",
    children: [
        {
            path: "/pay",
            name: "pay",
            component: () => import('@/views/pay/index.vue'),
        },
    ],
}
]
export default payRoute