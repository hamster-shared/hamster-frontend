// mock/json/marketplaceList.json
var marketplaceList_default = [
  {
    id: "1",
    image: "xxx",
    name: "\u5E01\u5708\u7D22\u7F57\u65AF",
    work: "\u6295\u8D44\u987E\u95EE",
    description: "\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90\u3001\u94B1\u5305\u76D1\u63A7\u3001\u81EA\u52A8min\u6316\u6398\u2026\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90"
  },
  {
    id: "2",
    image: "xxx",
    name: "\u5E01\u5708\u7D22\u7F57\u65AF",
    work: "\u6295\u8D44\u987E\u95EE",
    description: "\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90\u3001\u94B1\u5305\u76D1\u63A7\u3001\u81EA\u52A8min\u6316\u6398\u2026\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90"
  },
  {
    id: "3",
    image: "xxx",
    name: "\u5E01\u5708\u7D22\u7F57\u65AF",
    work: "\u6295\u8D44\u987E\u95EE",
    description: "\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90\u3001\u94B1\u5305\u76D1\u63A7\u3001\u81EA\u52A8min\u6316\u6398\u2026\u9879\u76EE\u7814\u62A5\u3001Alpha\u8D44\u6E90"
  }
];

// mock/agent.ts
var agent_default = [
  {
    url: "/api/getMarketplaceList",
    method: "get",
    response: ({ query }) => {
      return {
        code: 200,
        data: marketplaceList_default,
        message: "success"
      };
    }
  }
];
export {
  agent_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibW9jay9hZ2VudC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJEOlxcXFxOZXd0b3VjaFxcXFxwcm9qZWN0XFxcXGhhbXN0ZXItZnJvbnRlbmRcXFxcbW9ja1xcXFxhZ2VudC50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJEOlxcXFxOZXd0b3VjaFxcXFxwcm9qZWN0XFxcXGhhbXN0ZXItZnJvbnRlbmRcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vRDovTmV3dG91Y2gvcHJvamVjdC9oYW1zdGVyLWZyb250ZW5kL21vY2svYWdlbnQudHNcIjtpbXBvcnQgdHlwZSB7IE1vY2tNZXRob2QgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xuaW1wb3J0IG1hcmtldHBsYWNlTGlzdCBmcm9tICcuL2pzb24vbWFya2V0cGxhY2VMaXN0Lmpzb24nXG5leHBvcnQgZGVmYXVsdCBbXG4gIHtcbiAgICB1cmw6ICcvYXBpL2dldE1hcmtldHBsYWNlTGlzdCcsXG4gICAgbWV0aG9kOiAnZ2V0JyxcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogMjAwLFxuICAgICAgICBkYXRhOiBtYXJrZXRwbGFjZUxpc3QsXG4gICAgICAgIG1lc3NhZ2U6ICdzdWNjZXNzJ1xuICAgICAgfVxuICAgIH0sXG4gIH1cbl0gYXMgTW9ja01ldGhvZFtdXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU8sZ0JBQVE7QUFBQSxFQUNiO0FBQUEsSUFDRSxLQUFLO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixVQUFVLENBQUMsRUFBRSxNQUFNLE1BQU07QUFDdkIsYUFBTztBQUFBLFFBQ0wsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
