import httpMockRequest from "@/request/mockTestRequest";

/**
 * @description 获取marketplace列表
 */
export function apiGetMarketplaceMockList() {
    return httpMockRequest(
        {
            url: `/getMarketplaceList`,
            method: "get",
        }
    )
}