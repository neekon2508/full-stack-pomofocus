package backend.role.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import backend.role.model.RoleResponseVO;

@Mapper
public interface RoleUserRepository {

    boolean existRoleUsers(@Param("roleCode") String roleCode);

    int insertRoleUser(@Param("roleCode") String roleCode, @Param("userId") Long userId);

    int deleteRoleUsers(@Param("roleCode") String roleCode, @Param("userId") Long userId);

    List<RoleResponseVO> selectRolesByUserId(@Param("userId") Long userId);
}
