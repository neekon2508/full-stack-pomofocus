package backend.api.model;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Data
@Builder
public class SysApiResponseVO {

    @Schema(description = "API ID")
    private String apiId;

    @Schema(description = "API Name")
    private String apiName;

    @Schema(description = "API Url")
    private String apiUrl;

    @Schema(description = "API Method")
    private String apiMethod;

    @Schema(description = "API Code")
    private String apiCode;

    @Schema(description = "API Roles")
    private List<String> apiRoles;

    private String roleCodes;

    public void setRoleCodes(String roleCodes) {
        this.roleCodes = roleCodes;
        this.apiRoles = roleCodes != null ? Arrays.asList(roleCodes.split(",")) : Collections.emptyList();
    }
}
