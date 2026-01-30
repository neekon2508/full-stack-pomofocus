package backend.user.model;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Setter
public class UserResponseVO {

    @Schema(description = "Id", example = "1")
    private Integer id;

    @Schema(description = "Username", example = "username")
    private String username;
    
    @Schema(description = "email", example = "neekon@gmail.com")
    private String email;

    @Schema(description = "Password", example = "1239821093218")
    private String password;

    @Schema(description = "Status", example = "1")
    private Integer status;

    @Schema(description = "User Roles")
    private List<String> userRoles;

    private String roleCodes;

    public void setRoleCodes(String roleCodes) {
        this.roleCodes = roleCodes;
        this.userRoles = roleCodes != null ? Arrays.asList(roleCodes.split(",")) : Collections.emptyList();
    }
}
