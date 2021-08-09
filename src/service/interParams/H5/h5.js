export const h5Inters = {
    // H5分类新增接口
    submitCategory: '/ih5/category/submitCategory',
    // H5分类删除
    deleteCategory: '/ih5/category/deleteCategory/',
    // H5分类列表查询
    getCategoryList: '/ih5/category/getCategoryList',

    // H5分类新增接口、H5分类信息更新 H5分类列表查询
    register: '/ih5/api/user/register',
    // H5分类删除
    category: '/ih5/api/category/',
    // H5模板查询列表接口
    getTemplateListPage: '/ih5/template/getTemplateListPage',
    // H5模板详情接口
    getTemplateByIdDetails: '/ih5/template/getTemplateByIdDetails/',
    // H5场景保存接口
    addScene: '/ih5/scene/addScene',
    // 上传素材接口
    upload: '/ih5/material/upload',
    // 素材清单列查询接口
    getMultimediaList: '/ih5/material/getMultimediaList',
    // 素材删除接口
    deleteMultimedByid: '/ih5/material/deleteMultimedByid/',
    // H5场景详情接口
    sceneUpdateInfo: '/ih5/scene/sceneUpdateInfo/',
    // H5场景编辑更新接口
    updateSceneByid: '/ih5/scene/updateSceneByid',
    // H5场景设置更新接口
    updateSetSceneById: '/ih5/scene/updateSetSceneById',
    // 我的H5查询列表接口
    getSceneSelfList: '/ih5/scene/getSceneSelfList',
    // -H5场景删除接口
    deleteSceneInf: '/ih5/scene/deleteSceneInf/',
    // H5场景下线接口
    offlineScene: '/ih5/scene/offlineScene/',
    // H5场景发布接口
    publishScene: '/ih5/scene/publishScene/',
    // H5场景预览接口
    previewScene: '/ih5/scene/previewScene/',
    // H5未发布场景展示接口
    pViewSceneInf: '/ih5/scene/pViewSceneInf/',
    // H5已发布场景展示接口
    sViewSceneInf: '/ih5/scene/sViewSceneInf/',
    // H5模板新增接口
    addTemplate: '/ih5/template/addTemplate',
    // H5模板删除接口
    deleteTemplate: '/ih5/template/deleteTemplate/',
    // H5场景表单提交
    formSubmit:'/ih5/scene/formSubmit',
    // 手机组件获取验证码 {"mobileNo":"18650179700"}
    sendVCode:'/isys/vcode/sendVCode',
    // 保存用户行为
    saveCustomerBhvrInfo:'/imkt/spikerlala/customer/bhvr/saveCustomerBhvrInfo',
    userInfo: '/wxcp/wx/cp/userInfo', // 传code获取用户信息
    weixinToken: '/uaa/auth/weixinToken',
    submitCategory:'/ih5/category/submitCategory', //添加或更新分类
    // 获取分类
    getMultimediaCategoryList:'/ih5/material/getMultimediaCategoryList',
    // 修改图片分类
    joinMultimediaCategory:'/ih5/material/joinMultimediaCategory',
    // 批量删除素材库图片
    deleteSceneInfByIds:'/ih5/material/deleteMultimedByIds'
}