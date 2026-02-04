package backend.role.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import backend.role.model.RoleResponseVO;

@Mapper
public interface RoleRepository {

    List<RoleResponseVO> selectRoles(@Param("roleName") String roleName);
}
