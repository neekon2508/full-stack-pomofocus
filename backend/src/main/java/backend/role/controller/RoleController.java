package backend.role.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.common.constant.CommonConstants;
import backend.common.constant.StatusCodeConstants;
import backend.common.model.CommonResponseVO;
import backend.role.model.RoleResponseVO;
import backend.role.service.RoleService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class RoleController {

    private final RoleService roleService;

    @GetMapping(value = "/roles", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CommonResponseVO<List<RoleResponseVO>>> findRoles(
        @Parameter(description = "Role Name") @RequestParam(required = false) String roleName) {
        
        return ResponseEntity.ok(
            CommonResponseVO.<List<RoleResponseVO>>builder()
                            .successOrNot(CommonConstants.YES_FLAG)
                            .statusCode(StatusCodeConstants.SUCCESS)
                            .data(roleService.findRoles(roleName))
                            .build()
        );
    }
    
}
