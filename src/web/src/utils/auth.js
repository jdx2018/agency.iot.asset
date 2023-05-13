export function setToken(token) {
  window.sessionStorage.setItem("access_token", token);
}

export function setPageData(page) {
  window.sessionStorage.setItem("page", JSON.stringify(page));
}

export function getFuncs() {
  const sessionStorage = window.sessionStorage
  const pageListFromSessionStorage = sessionStorage.getItem("page") ? JSON.parse(sessionStorage.getItem("page")) : []
  return pageListFromSessionStorage.find(page => window.location.pathname.slice(1) === page.pageName)?.funcObj

}

export function getPageData(isProcessed = true) {
  const sessionStorage = window.sessionStorage
  const pageListFromSessionStorage = JSON.parse(sessionStorage.getItem("page"))
  const pageList = pageListFromSessionStorage ? pageListFromSessionStorage : [];
  if (isProcessed) {
    const canVisiblePageList = pageList.filter(page => {
      const p = pageList.filter(_ => page.pageId === _.parentId)
      if (page.status) {
        return true
      }
      if (p.some(_ => _.status)) {
        return true
      }

    });
    const sortedPageList = canVisiblePageList.sort((a, b) => a.showIndex - b.showIndex)

    // function pagePermissionFilter(pageList) {
    //   const notVisiblePageList = pageList.filter(page => !page.status)
    //   const notVisiblePageIdList = notVisiblePageList.map((item) => {
    //     return item.pageId;
    //   });
    //   let result = pageList.filter((item) => {
    //     const { pageId, parentId } = item;
    //     if (notVisiblePageIdList.indexOf(pageId) === -1 && notVisiblePageIdList.indexOf(parentId) === -1) {
    //       return true;
    //     } else {
    //       if (pageId === "1" || pageId === "2") {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     }
    //   });
    //   return result;
    // }
    return sortedPageList;
  } else {
    return pageList
  }

}

export function getToken() {
  return window.sessionStorage.getItem("access_token");
}

export function getUserinfo() {
  return JSON.parse(window.sessionStorage.getItem("userinfo"));
}

export function setUserinfo(userinfo) {
  window.sessionStorage.setItem("userinfo", JSON.stringify(userinfo));
}

export function getCurTableFilterCount() {
  return JSON.parse(window.sessionStorage.getItem("curTableFilterCount"));
}