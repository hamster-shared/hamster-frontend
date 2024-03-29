// 导入axios实例
import httpRequest from "@/request";

// 查询模版分类信息
export function apiTemplatesCategory(type: String) {
  return httpRequest({
    url: "/api/templates-category",
    method: "get",
    params: {
      type: type
    },
  });
}
// 根据模版类型ID查询模版信息
export function apiTemplatesCategoryById(id: String, languageType: string, deployType: String) {
  return httpRequest({
    url: `/api/templates-category/${id}/templates`,
    method: "get",
    params: {
      languageType: languageType,
      deployType: deployType,
    },
  });
}
// 查询模版详情
export function apiTemplatesDetail(id: String) {
  return httpRequest({
    url: `/api/templates/${id}`,
    method: "get",
  });
}

// 查询前端模板
export function apiFrontendTemplatesDetail(id: String) {
  return httpRequest({
    url: `/api/frontend-templates/${id}`,
    method: "get",
  });
}

//Popular Template
export function apiTemplatesShow(type: String, languageType: String, deployType: String) {
  return httpRequest({
    url: "/api/templates/show",
    method: "get",
    params: {
      type: type,
      languageType: languageType,
      deployType: deployType,
    },
  });
}

//Download Template
export function apiDownloadTemplate(id: String, repoName: String) {
  return httpRequest({
    url: `/api/templates/${id}/download`,
    method: "post",
    params: {
      repoName: repoName,
    },
  });
}

