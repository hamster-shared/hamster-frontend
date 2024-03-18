import httpRequest from "@/request/mockRequest";

/**
 * @description 获取marketplace列表
 */
export function apiGetMarketplaceMockList() {
    return httpRequest(
        {
            url: `/getMarketplaceList`,
            method: "get",
        }
    )
}