package backend.role.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RoleResponseVO {

    @Schema(description = "Role Code", example = "ADMIN")
    private String roleCode;

    @Schema(description = "Role Name", example = "admin")
    private String roleName;
}
