package backend.api.service;

import java.util.List;

import backend.api.model.SysApiConditionVO;
import backend.api.model.SysApiRequestVO;
import backend.api.model.SysApiResponseVO;
import backend.common.model.DmlResponseVO;

public interface SysApiService {

    List<SysApiResponseVO> findSysApis(SysApiConditionVO apiCondition);

    DmlResponseVO saveSysApis(List<SysApiRequestVO> apis);

    boolean checkAccessibleApiUrlByRoleCodes(String apiUrl, String httpMethodCode, List<String> roleCodes);
}
