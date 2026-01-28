package backend.api.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;

import backend.api.model.SysApiConditionVO;
import backend.api.model.SysApiRequestVO;
import backend.api.model.SysApiResponseVO;

@Mapper
public interface SysApiRepository {

    List<SysApiResponseVO> selectSysApis(@Param("sysApiCondition") SysApiConditionVO sysApiCondition);

    int insertSysApi(@Param("sysApi") SysApiRequestVO sysApi);

    int updateSysApi(@Param("sysApi") SysApiRequestVO sysApi);

    int deleteSysApi(String apiId);

    List<String> selectApiRoleCodes(String apiId);

    int deleteAllApiRoles(String apiId);

    int insertApiRoles(@Param("apiId") String apiId, @Param("roleCodes") List<String> roleCodes);

    boolean existSysApi(@Param("sysApi") String sysApi, @Param("httpMethodCode") String httpMethodCode);

    boolean checkAccessibleApiUrlByRoleCodes(@Param("apiUrl") String apiUrl, @Param("httpMethodCode") String httpMethodCode, @Param("roleCodes") List<String> roleCodes);
}
