package backend.api.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.api.model.SysApiConditionVO;
import backend.api.model.SysApiRequestVO;
import backend.api.model.SysApiResponseVO;
import backend.api.repository.SysApiRepository;
import backend.common.constant.CrudConstants;
import backend.common.model.DmlResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SysApiServiceImpl implements SysApiService{

    private final SysApiRepository sysApiRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SysApiResponseVO> findSysApis(SysApiConditionVO apiCondition) {
        List<SysApiResponseVO> apis = sysApiRepository.selectSysApis(apiCondition);
        return apis;
    }

    @Override
    public DmlResponseVO saveSysApis(List<SysApiRequestVO> apis) {
        DmlResponseVO dmlResponseVO = new DmlResponseVO();

        List<SysApiRequestVO> insertApiList = new ArrayList<>();
        List<SysApiRequestVO> updateApiList = new ArrayList<>();
        List<SysApiRequestVO> deleteApiList = new ArrayList<>();

        for (SysApiRequestVO api : apis)
            switch (api.getCrudKey().toUpperCase()) {
                case CrudConstants.CREATE:
                    insertApiList.add(api);
                    break;
                case CrudConstants.UPDATE:
                    updateApiList.add(api);
                    break;
                case CrudConstants.DELETE:
                    deleteApiList.add(api);
                    break;
            }
        // dmlResponseVO.setDeletedRows(remo);
        return dmlResponseVO;

    }

    @Override
    public boolean checkAccessibleApiUrlByRoleCodes(String apiUrl, String httpMethodCode, List<String> roleCodes) {
        boolean exists = sysApiRepository.existSysApi(apiUrl, httpMethodCode);

        //If api is not registered, it's considered accessible
        if (!exists)
            return true;

        return sysApiRepository.checkAccessibleApiUrlByRoleCodes(apiUrl, httpMethodCode, roleCodes);
    }

}
