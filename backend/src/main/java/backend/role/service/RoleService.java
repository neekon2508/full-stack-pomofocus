package backend.role.service;

import java.util.List;

import backend.role.model.RoleResponseVO;

public interface RoleService {

    List<RoleResponseVO> findRoles(String roleName);
    
}
