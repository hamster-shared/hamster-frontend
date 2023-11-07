const payRoute = [
{
    path: "/middleware/pay",
    children: [
        {
            path: "/middleware/pay",
            name: "pay",
            component: () => import('@/views/pay/index.vue'),
        },
    ],
}
]
export default payRoute